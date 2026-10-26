import {
  isAlias,
  isMap,
  isScalar,
  parseDocument,
  stringify,
  visit,
} from 'yaml';

export type Direction = 'yaml-to-json' | 'json-to-yaml';
const MAX_INPUT = 100_000;
const MAX_DEPTH = 50;

/** Reject values JSON cannot represent instead of silently coercing or dropping data. */
function jsonValue(value: unknown, depth = 0, budget = { nodes: 0 }): unknown {
  if (depth > MAX_DEPTH) throw new Error('Maximum nesting limit is 50 levels.');
  if (++budget.nodes > 10_000)
    throw new Error('Maximum node limit is 10,000 values.');
  if (typeof value === 'bigint') {
    if (
      value > BigInt(Number.MAX_SAFE_INTEGER) ||
      value < BigInt(Number.MIN_SAFE_INTEGER)
    )
      throw new Error(
        'Integers must stay within JavaScript’s safe integer range. Quote larger numbers.',
      );
    return Number(value);
  }
  if (
    typeof value === 'number' &&
    (!Number.isFinite(value) ||
      (Number.isInteger(value) && !Number.isSafeInteger(value)))
  )
    throw new Error(
      'Numbers must be finite and integers must stay in the safe integer range.',
    );
  if (value === null || ['string', 'number', 'boolean'].includes(typeof value))
    return value;
  if (Array.isArray(value))
    return value.map((item) => jsonValue(item, depth + 1, budget));
  if (typeof value === 'object') {
    const entries =
      value instanceof Map ? [...value.entries()] : Object.entries(value);
    const result = Object.create(null) as Record<string, unknown>;
    for (const [key, item] of entries) {
      if (typeof key !== 'string')
        throw new Error(
          'JSON requires string mapping keys. Quote numeric or boolean YAML keys.',
        );
      result[key] = jsonValue(item, depth + 1, budget);
    }
    return result;
  }
  throw new Error('This value cannot be represented in JSON.');
}

export function convertYamlJson(input: string, direction: Direction): string {
  if (input.length > MAX_INPUT)
    throw new Error('Input limit: 100,000 characters.');
  if (!input.trim()) throw new Error('Enter a YAML document or JSON value.');
  let value: unknown;
  if (direction === 'json-to-yaml') {
    value = jsonValue(JSON.parse(input));
  } else {
    const doc = parseDocument(input, {
      version: '1.2',
      schema: 'core',
      resolveKnownTags: false,
      customTags: [],
      uniqueKeys: true,
      intAsBigInt: true,
    });
    if (doc.errors.length) throw new Error(doc.errors[0].message);
    if (doc.warnings.length) throw new Error(doc.warnings[0].message);
    if (doc.directives.yaml.explicit && doc.directives.yaml.version !== '1.2')
      throw new Error('Only YAML 1.2 is supported.');
    let nodes = 0;
    visit(doc, (_, node, path) => {
      if (path.length > MAX_DEPTH * 2)
        throw new Error('Maximum nesting limit is 50 levels.');
      if (++nodes > 10_000)
        throw new Error('Maximum node limit is 10,000 values.');
      if (isAlias(node))
        throw new Error(
          'YAML aliases are not supported. Expand aliases before converting.',
        );
      if (isMap(node)) {
        for (const pair of node.items) {
          if (!isScalar(pair.key) || typeof pair.key.value !== 'string')
            throw new Error(
              'JSON requires string mapping keys. Quote YAML keys.',
            );
          if (pair.key.value === '<<')
            throw new Error(
              'YAML merge keys are not supported. Expand merged mappings first.',
            );
        }
      }
    });
    value = jsonValue(doc.toJS({ mapAsMap: true, maxAliasCount: 0 }));
  }
  const output =
    direction === 'json-to-yaml'
      ? stringify(value, { version: '1.2', indent: 2, lineWidth: 0 })
      : JSON.stringify(value, null, 2);
  if (output.length > 400_000)
    throw new Error('Output limit: 400,000 characters.');
  return output;
}
