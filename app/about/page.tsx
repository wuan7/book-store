"use client";

import Image from "next/image";

const AboutPage = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center text-gray-800 dark:text-white">
        Giới thiệu về chúng tôi
      </h1>

      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <p>
            Chúng tôi là một đội ngũ đam mê công nghệ và sáng tạo, với sứ mệnh
            mang đến trải nghiệm mua sắm trực tuyến tốt nhất cho người dùng.
          </p>
          <p>
            Tại đây, bạn sẽ tìm thấy những sản phẩm chất lượng, giá cả hợp lý
            cùng với dịch vụ khách hàng tận tâm. Chúng tôi luôn lắng nghe và
            cải tiến để phục vụ bạn tốt hơn mỗi ngày.
          </p>
          <p>Cảm ơn bạn đã tin tưởng và đồng hành cùng chúng tôi!</p>
        </div>

        <div className="relative w-full h-64 md:h-80">
          <Image
            src="/aboutus.png"
            alt="About us"
            fill
            className="rounded-xl object-cover shadow-md"
          />
        </div>
      </div>

      <div className="mt-12 text-center">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
          Liên hệ với chúng tôi
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-2">
          Email: support@bookstore.vn
        </p>
        <p className="text-gray-600 dark:text-gray-400 mb-2">
          Hotline: 0123 456 789
        </p>
        <p className="text-gray-600 dark:text-gray-400">
          Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
