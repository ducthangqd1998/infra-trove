import type { Lang } from './blog';

/** Copy for the guide pages only. Site chrome (header, footer, tools) stays English. */
export const blogText: Record<
  Lang,
  {
    indexTitle: string;
    indexDescription: string;
    indexIntro: string;
    badge: string;
    all: string;
    filterLabel: string;
    guides: string;
    allGuides: string;
    languageLabel: string;
    featured: string;
    updated: string;
    toc: string;
    byline: string;
    related: string;
    ctaTitle: string;
    ctaBody: string;
    ctaButton: string;
    openGuide: string;
    translationLink: string;
    comments: string;
    commentsLoading: string;
    commentsEmpty: string;
    commentsUnavailable: string;
    commentName: string;
    commentBody: string;
    commentSubmit: string;
    commentPosting: string;
    commentPosted: string;
    commentError: string;
    commentNote: string;
  }
> = {
  en: {
    indexTitle: 'Practical guides',
    indexDescription:
      'Clear explanations of JSON, encoding and cron schedules, with examples you can use in InfraTrove tools.',
    indexIntro: 'Understand the format. Avoid the pitfalls. Get back to work.',
    badge: 'Guides',
    all: 'All',
    filterLabel: 'Filter guides by category',
    guides: 'Guides',
    allGuides: 'All guides',
    languageLabel: 'Guide language',
    featured: 'Latest guide',
    updated: 'Updated',
    toc: 'On this page',
    byline: 'InfraTrove Editorial',
    related: 'Keep reading',
    ctaTitle: 'Try it on your own data',
    ctaBody: 'Runs in your browser. Nothing is uploaded, nothing is saved.',
    ctaButton: 'Open tool',
    openGuide: 'Read guide',
    translationLink: 'Đọc bài này bằng tiếng Việt',
    comments: 'Comments',
    commentsLoading: 'Loading comments…',
    commentsEmpty: 'No comments yet. Start the conversation.',
    commentsUnavailable: 'Comments are not available on this server.',
    commentName: 'Name',
    commentBody: 'Comment',
    commentSubmit: 'Post comment',
    commentPosting: 'Posting…',
    commentPosted: 'Thanks, your comment is live.',
    commentError: 'Could not post your comment.',
    commentNote:
      'We keep your name and comment. Your IP address is never stored; a fingerprint that changes daily limits spam. Cloudflare Turnstile verification loads only when you start writing.',
  },
  vi: {
    indexTitle: 'Hướng dẫn thực hành',
    indexDescription:
      'Giải thích rõ ràng về JSON, mã hóa và lịch cron, kèm ví dụ bạn có thể thử ngay trong các công cụ của InfraTrove.',
    indexIntro: 'Hiểu định dạng. Tránh bẫy thường gặp. Quay lại làm việc.',
    badge: 'Hướng dẫn',
    all: 'Tất cả',
    filterLabel: 'Lọc hướng dẫn theo danh mục',
    guides: 'Hướng dẫn',
    allGuides: 'Tất cả hướng dẫn',
    languageLabel: 'Ngôn ngữ bài viết',
    featured: 'Bài mới nhất',
    updated: 'Cập nhật',
    toc: 'Trong bài viết này',
    byline: 'Ban biên tập InfraTrove',
    related: 'Đọc tiếp',
    ctaTitle: 'Thử ngay với dữ liệu của bạn',
    ctaBody: 'Chạy ngay trong trình duyệt. Không tải lên, không lưu lại gì cả.',
    ctaButton: 'Mở công cụ',
    openGuide: 'Đọc bài viết',
    translationLink: 'Read this guide in English',
    comments: 'Bình luận',
    commentsLoading: 'Đang tải bình luận…',
    commentsEmpty: 'Chưa có bình luận nào. Hãy là người đầu tiên.',
    commentsUnavailable: 'Máy chủ này chưa bật bình luận.',
    commentName: 'Tên',
    commentBody: 'Bình luận',
    commentSubmit: 'Gửi bình luận',
    commentPosting: 'Đang gửi…',
    commentPosted: 'Cảm ơn bạn, bình luận đã được đăng.',
    commentError: 'Không gửi được bình luận.',
    commentNote:
      'Chúng tôi lưu tên và nội dung bình luận. Địa chỉ IP của bạn không bao giờ được lưu; một dấu vân tay đổi mỗi ngày dùng để chặn spam. Bước xác minh Cloudflare Turnstile chỉ tải khi bạn bắt đầu viết.',
  },
};
