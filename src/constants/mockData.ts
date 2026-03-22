export interface MomentStory {
  id: string;
  imageUrl: string;
  blurhash: string;
  tag: string;
  title: string;
  caption: string;
  ctaLabel: string;
}

export const MOMENT_STORIES: MomentStory[] = [
  {
    id: "1",
    imageUrl:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&fm=webp&q=80",
    blurhash: "LGF5?xYk^6#M@-5c,1J5@[or[Q6.",
    tag: "Học tiếng Anh",
    title: "Từ sợ hãi đến tự tin",
    caption:
      "Lần đầu tiên Minh dám nói chuyện với người nước ngoài mà không run tay — cảm giác đó thật tuyệt vời.",
    ctaLabel: "Đọc câu chuyện",
  },
  {
    id: "2",
    imageUrl:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&fm=webp&q=80",
    blurhash: "LKO2:N%2Tw=w]~RBVZRi};RPxuwH",
    tag: "IELTS Journey",
    title: "Đạt 7.5 sau 6 tháng",
    caption:
      "Không ai nghĩ cô gái rụt rè ấy có thể đạt band 7.5 chỉ sau nửa năm luyện tập mỗi ngày.",
    ctaLabel: "Xem hành trình",
  },
  {
    id: "3",
    imageUrl:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&fm=webp&q=80",
    blurhash: "LBH,K]t7Rwof00ay?bj?NGj[Rjax",
    tag: "Nhóm học",
    title: "Bạn bè cùng tiến",
    caption:
      "Học cùng nhau, vấp ngã cùng nhau — và đứng dậy cùng nhau. Đó mới là ký ức đáng nhớ nhất.",
    ctaLabel: "Câu chuyện nhóm",
  },
  {
    id: "4",
    imageUrl:
      "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&fm=webp&q=80",
    blurhash: "L7B|]p00Di9Z~VWBt6Rj00j]?bkC",
    tag: "Du học",
    title: "Cánh cửa mới mở rộng",
    caption:
      "Học bổng toàn phần tại Úc — điều Tuấn chưa bao giờ dám mơ cho đến khi anh bắt đầu học tại ZIM.",
    ctaLabel: "Nghe câu chuyện",
  },
  {
    id: "5",
    imageUrl:
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&fm=webp&q=80",
    blurhash: "LDEy7n~V%LIU-;xaIpWB9ZWBxuoM",
    tag: "Thăng tiến",
    title: "Thăng chức nhờ tiếng Anh",
    caption:
      "Khi có thể tự tin thuyết trình bằng tiếng Anh, sếp tôi đã nhìn tôi với ánh mắt hoàn toàn khác.",
    ctaLabel: "Đọc thêm",
  },
];
