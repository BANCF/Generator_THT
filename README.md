# 🤖 Trình Thiết Kế Đề Thi & Sinh Testcase Tin Học Trẻ

Ứng dụng web tối tân giúp giáo viên tin học tự động hóa toàn bộ quy trình thiết kế đề bài, lập trình lời giải mẫu và sinh bộ testcase chất lượng cao (đầy đủ phân bổ subtask) bám sát cấu trúc kỳ thi Tin học trẻ Bảng A (Tiểu học - Scratch) và Bảng B (THCS - C++/Python).

---

## ✨ Tính năng cốt lõi

1. **📚 Thư viện 16 Dạng đề bám sát đề thi thực tế:**
   - **Cấp 1 (Scratch):** Vẽ đa giác lồng nhau, vẽ hoa xoay tròn, đếm số chia hết, tách chữ số lẻ, tính tổng dãy số cách đều, tìm số chính phương, bài toán gà chó/giả thiết tạm, Euclid ước chung lớn nhất.
   - **Cấp 2 (C++/Python):** Tổng ước số lẻ cực đại ($O(\log N)$), đếm số siêu nguyên tố, xâu đối xứng dài nhất (LIS/LCS), chuẩn hóa xâu họ tên, nén chuỗi (RLE), tổng đoạn con lớn nhất (Kadane), bài toán đổi tiền xu.
2. **🎲 Tạo biến thể & Ngẫu nhiên hóa tự động:**
   - Mỗi dạng bài có nhiều kiểu biến thể toán học độc lập.
   - Tên nhân vật (Tí, Tèo, An, Bình...) và bối cảnh được ngẫu nhiên hóa liên tục sau mỗi lần bấm sinh đề.
3. **⚡ Sinh Testcase cục bộ siêu tốc bằng JavaScript:**
   - Trình duyệt tự biên dịch và chạy hàm sinh input/solver của thuật toán để tạo ra hơn 10+ testcases bao phủ đủ 100% các phân nhóm subtask chỉ trong vài mili-giây.
4. **📦 Tải trọn gói 1 click (.zip):**
   - File nén ZIP tải về chứa đầy đủ: Đề bài Markdown (`.md`), Lời giải mẫu (`LoiGiai/` với code Python và C++), thư mục testcase phẳng (`Testcases_Flat/` với 1.inp, 1.out...), và thư mục testcase kiểu Themis (`Testcases_Themis/` chia theo Test01, Test02...).
5. **🗃️ Ngân hàng đề bài thông minh:**
   - Tự động lưu trữ các đề bài đã sinh vào trình duyệt. Người dùng có thể dễ dàng quản lý, mở lại, chỉnh sửa hoặc xóa bất cứ lúc nào.
6. **🤖 Trình sinh đề vô hạn bằng AI (Tương thích Ollama & Cloud APIs):**
   - Hỗ trợ gọi AI cục bộ (Ollama) hoặc các API Cloud để viết đề bài và lập trình mã nguồn sinh testcase tự động.

---

## 🛠️ Hướng dẫn chạy cục bộ (Local)

Để chạy ứng dụng ngay trên máy tính của bạn:

1. **Tải mã nguồn về máy.**
2. **Chạy server local:**
   - Bấm đúp vào file `serve.ps1` hoặc mở PowerShell tại thư mục dự án và chạy:
     ```powershell
     powershell -ExecutionPolicy Bypass -File .\serve.ps1
     ```
3. **Mở trình duyệt:** Truy cập địa chỉ **[http://localhost:8080](http://localhost:8080)** để bắt đầu sử dụng.

---

## 🚀 Hướng dẫn kết nối Trình sinh đề bằng AI

Ứng dụng tích hợp trình sinh đề thông minh bằng cách kết nối với **Ollama (AI cục bộ)** hoặc các **API Cloud (DeepSeek, OpenAI...)**.

### 1. Dành cho người dùng chạy cục bộ (http://localhost:8080)
Khi bạn chạy web ở localhost, bạn có thể kết nối **trực tiếp** tới Ollama trên máy tính của mình mà không cần qua mạng internet hay cấu hình đường truyền phức tạp:

1. **Mở CORS cho Ollama (Bắt buộc - Chỉ cần cấu hình 1 lần trên Windows):**
   - Nhấn nút Windows trên bàn phím, gõ **`env`** -> Chọn **Edit the system environment variables**.
   - Bấm nút **Environment Variables...** ở phía dưới.
   - Tại bảng **User variables**, bấm **New...** để thêm biến mới:
     * **Variable name:** `OLLAMA_ORIGINS`
     * **Variable value:** `*`
   - Nhấn **OK** để lưu lại.
   - Click chuột phải vào biểu tượng Ollama (hình con lạc đà) dưới khay hệ thống Taskbar chọn **Quit Ollama**, sau đó khởi động lại ứng dụng Ollama để nạp cấu hình mới.
2. **Cấu hình trên Web:**
   - **Địa chỉ API Endpoint:** `http://localhost:11434/v1`
   - **API Key:** Để trống hoàn toàn.
   - **Model AI:** Chọn model đang có trong máy của bạn (ví dụ: `qwen2.5-coder:7b` hoặc `llama3`).
   - Bấm **SINH ĐỀ & THIẾT LẬP BẰNG AI**.

---

### 2. Dành cho người dùng truy cập Online (HTTPS trên Vercel)
Khi truy cập qua liên kết online dạng HTTPS (ví dụ Vercel), trình duyệt sẽ chặn kết nối HTTP không bảo mật trực tiếp đến máy tính của bạn (lỗi *Failed to fetch* do Mixed Content). Người dùng có 2 giải pháp sau:

#### Giải pháp A: Kết nối đến Ollama cá nhân dưới máy bằng Localtunnel
1. Mở PowerShell dưới máy tính cá nhân và chạy lệnh tạo đường truyền HTTPS bảo mật:
   ```powershell
   npx localtunnel --port 11434
   ```
   *Bạn sẽ nhận được một đường link dạng: `https://xxxx.loca.lt`*
2. Dán đường dẫn này vào ô **Địa chỉ API Endpoint** trên trang web Vercel và thêm `/v1` ở cuối.
   *Ví dụ:* `https://xxxx.loca.lt/v1`
3. Để trống ô **API Key** và bấm **SINH ĐỀ & THIẾT LẬP BẰNG AI**.
   *(Hệ thống đã tự động chèn header bypass nên sẽ chạy trực tiếp mượt mà, không gặp bất cứ trang cảnh báo nào).*

#### Giải pháp B: Sử dụng dịch vụ AI Cloud (Không cần cài đặt gì dưới máy)
Người dùng chỉ cần có API Key cá nhân của các dịch vụ đám mây là có thể dùng trực tiếp trên web Vercel:

- **DeepSeek:**
  - **Địa chỉ API Endpoint:** `https://api.deepseek.com/v1`
  - **API Key:** Nhập API Key DeepSeek của bạn.
  - **Model AI:** Chọn nhập model tùy chỉnh gõ `deepseek-chat` hoặc `deepseek-reasoner`.
- **OpenRouter (Tổng hợp các model Llama 3, Claude, GPT miễn phí & trả phí):**
  - **Địa chỉ API Endpoint:** `https://openrouter.ai/api/v1`
  - **API Key:** Nhập API Key OpenRouter của bạn.
  - **Model AI:** Gõ model muốn dùng (ví dụ: `meta-llama/llama-3-8b-instruct:free`).

---

## 🌐 Triển khai lên Vercel (Hosting)

Nếu bạn muốn tự đưa dự án này lên Vercel của riêng mình:

1. Đăng nhập Vercel CLI bằng lệnh:
   ```powershell
   npx.cmd vercel login
   ```
2. Thực hiện deploy dự án lên production chỉ bằng một dòng lệnh duy nhất:
   ```powershell
   npx.cmd vercel deploy --prod --yes
   ```
