// Massive Library of 36 Contest Problems with Multi-Variations (Cấp 1 Scratch & Cấp 2 C++/Python)
const contestGenerators = [
  // ==================== CẤP 1 (TIỂU HỌC - SCRATCH) ====================
  {
    id: "c1_ve_da_giac",
    title: "Vẽ hình: Đa giác lồng nhau",
    level: "cap1",
    variations: [
      {
        subTitle: "Tính tổng quãng đường vẽ đa giác đều xoay quanh tâm",
        description: "Chú mèo Scratch cần vẽ một cụm hình nghệ thuật gồm ~K~ đa giác đều xếp chồng và xoay quanh tâm. Đa giác đều này có ~N~ cạnh và chiều dài mỗi cạnh là ~A~ bước. Mèo Scratch bắt đầu tại gốc tọa độ ~(0,0)~. Vẽ xong một đa giác, mèo sẽ xoay một góc ~360/K~ độ để vẽ đa giác tiếp theo. Hãy lập trình tính tổng độ dài quãng đường mèo đã di chuyển sau khi vẽ xong hình.",
        inputDesc: "Dòng đầu chứa số nguyên dương ~K~. Dòng thứ hai chứa hai số nguyên dương ~N~ và ~A~ cách nhau bởi dấu cách.",
        outputDesc: "Một số nguyên duy nhất là tổng quãng đường di chuyển của chú mèo.",
        subtasks: [
          { id: 1, percent: 50, limit: "K \\le 10", desc: "vòng lặp vẽ cơ bản.", minVal: 3, maxVal: 10 },
          { id: 2, percent: 50, limit: "K \\le 1000", desc: "thuật toán tính nhanh.", minVal: 11, maxVal: 1000 }
        ],
        sampleTests: [{ input: "4\n3 50", output: "600", explain: "4 hình * 3 cạnh * 50 bước = 600." }],
        generateInput: function(subtaskId) {
          const sub = this.subtasks.find(s => s.id === subtaskId);
          const K = Math.floor(Math.random() * (sub.maxVal - sub.minVal + 1)) + sub.minVal;
          const N = Math.floor(Math.random() * 6) + 3;
          const A = (Math.floor(Math.random() * 19) + 2) * 10;
          return `${K}\n${N} ${A}`;
        },
        solve: function(inputStr) {
          const lines = inputStr.trim().split("\n");
          const K = BigInt(lines[0].trim());
          const parts = lines[1].trim().split(/\s+/);
          return (K * BigInt(parts[0]) * BigInt(parts[1])).toString();
        },
        solutionCodePython: `# Quãng đường = K * N * A\nimport sys\ndata = sys.stdin.read().split()\nif len(data) >= 3:\n    print(int(data[0]) * int(data[1]) * int(data[2]))`,
        solutionCodeCpp: `#include <iostream>\nusing namespace std;\nint main() {\n    long long K, N, A;\n    if (cin >> K >> N >> A) cout << K * N * A << endl;\n    return 0;\n}`
      },
      {
        subTitle: "Tính tổng quãng đường vẽ chuỗi đa giác tăng dần kích thước",
        description: "Chú mèo Scratch cần vẽ một chuỗi gồm ~K~ đa giác đều xếp chồng đồng tâm. Đa giác thứ nhất có cạnh dài ~A~ bước. Cứ sau mỗi đa giác, chiều dài cạnh của đa giác tiếp theo tăng thêm ~D~ bước. Tất cả đa giác đều là đa giác đều có ~N~ cạnh. Hãy lập trình tính tổng quãng đường chú mèo Scratch đã di chuyển để vẽ xong chuỗi đa giác này.",
        inputDesc: "Dòng đầu chứa số nguyên dương ~K~. Dòng thứ hai chứa ba số nguyên dương ~N~, ~A~ và ~D~ cách nhau bởi dấu cách.",
        outputDesc: "Một số nguyên duy nhất là tổng quãng đường di chuyển.",
        subtasks: [
          { id: 1, percent: 50, limit: "K \\le 10", desc: "duyệt lặp vẽ cơ bản.", minVal: 1, maxVal: 10 },
          { id: 2, percent: 50, limit: "K \\le 1000", desc: "yêu cầu công thức tính tổng cấp số cộng.", minVal: 11, maxVal: 1000 }
        ],
        sampleTests: [{ input: "3\n4 10 5", output: "180", explain: "Hình 1: 4 * 10 = 40. Hình 2: 4 * 15 = 60. Hình 3: 4 * 20 = 80. Tổng = 180." }],
        generateInput: function(subtaskId) {
          const sub = this.subtasks.find(s => s.id === subtaskId);
          const K = Math.floor(Math.random() * (sub.maxVal - sub.minVal + 1)) + sub.minVal;
          const N = Math.floor(Math.random() * 5) + 3;
          const A = (Math.floor(Math.random() * 10) + 1) * 10;
          const D = (Math.floor(Math.random() * 5) + 1) * 5;
          return `${K}\n${N} ${A} ${D}`;
        },
        solve: function(inputStr) {
          const lines = inputStr.trim().split("\n");
          const K = BigInt(lines[0].trim());
          const parts = lines[1].trim().split(/\s+/);
          const N = BigInt(parts[0]), A = BigInt(parts[1]), D = BigInt(parts[2]);
          // Sum = N * sum(A + i*D for i=0..K-1) = N * [K*A + D*K*(K-1)/2]
          const sumEdges = K * A + (D * K * (K - 1n)) / 2n;
          return (N * sumEdges).toString();
        },
        solutionCodePython: `# Tổng = N * [K*A + D*K*(K-1)/2]\nimport sys\ndata = sys.stdin.read().split()\nif len(data) >= 4:\n    K, N, A, D = int(data[0]), int(data[1]), int(data[2]), int(data[3])\n    sum_edges = K * A + (D * K * (K - 1)) // 2\n    print(N * sum_edges)`,
        solutionCodeCpp: `#include <iostream>\nusing namespace std;\nint main() {\n    long long K, N, A, D;\n    if (cin >> K >> N >> A >> D) {\n        long long sum_edges = K * A + D * K * (K - 1) / 2;\n        cout << N * sum_edges << endl;\n    }\n    return 0;\n}`
      }
    ]
  },
  {
    id: "c1_ve_hoa",
    title: "Vẽ hình: Bông hoa xoay",
    level: "cap1",
    variations: [
      {
        subTitle: "Bông hoa xoay tạo bởi hình tròn",
        description: "Bạn Bo muốn vẽ một bông hoa tạo bởi ~K~ hình tròn xoay quanh tâm. Để vẽ một hình tròn, chú mèo Scratch di chuyển ~1~ bước rồi xoay ~1~ độ, lặp lại ~360~ lần. Hỏi sau khi vẽ xong toàn bộ bông hoa gồm ~K~ cánh tròn đó, tổng số bước di chuyển của chú mèo là bao nhiêu?",
        inputDesc: "Một dòng duy nhất chứa số nguyên dương ~K~.",
        outputDesc: "Một số nguyên duy nhất là tổng số bước di chuyển.",
        subtasks: [{ id: 1, percent: 100, limit: "K \\le 1000", desc: "tối ưu tính toán.", minVal: 3, maxVal: 1000 }],
        sampleTests: [{ input: "5", output: "1800" }],
        generateInput: function(subtaskId) {
          return (Math.floor(Math.random() * 500) + 3).toString();
        },
        solve: function(inputStr) { return (BigInt(inputStr.trim()) * 360n).toString(); },
        solutionCodePython: `import sys\nfor line in sys.stdin:\n    if line.strip(): print(int(line.strip()) * 360)`,
        solutionCodeCpp: `#include <iostream>\nusing namespace std;\nint main() {\n    long long K;\n    if (cin >> K) cout << K * 360 << endl;\n    return 0;\n}`
      },
      {
        subTitle: "Bông hoa xoay tạo bởi hình vuông",
        description: "Bạn Bo vẽ bông hoa tạo bởi ~K~ hình vuông lồng xoay quanh tâm. Mỗi hình vuông có chiều dài cạnh là ~A~ bước. Mèo di chuyển vẽ xong hình vuông rồi xoay góc ~360/K~ để vẽ tiếp hình vuông sau. Tính tổng quãng đường di chuyển vẽ bông hoa hình vuông này.",
        inputDesc: "Dòng đầu chứa ~K~. Dòng thứ hai chứa ~A~.",
        outputDesc: "Một số nguyên duy nhất là tổng quãng đường.",
        subtasks: [{ id: 1, percent: 100, limit: "K, A \\le 1000", desc: "Mỗi hình vuông dài 4*A, vẽ K hình mất K*4*A bước.", minVal: 4, maxVal: 1000 }],
        sampleTests: [{ input: "5\n50", output: "1000", explain: "5 hình vuông * 4 cạnh * 50 bước = 1000." }],
        generateInput: function(subtaskId) {
          return `${Math.floor(Math.random() * 100) + 3}\n${Math.floor(Math.random() * 100) + 10}`;
        },
        solve: function(inputStr) {
          const parts = inputStr.trim().split(/\s+/).map(BigInt);
          return (parts[0] * 4n * parts[1]).toString();
        },
        solutionCodePython: `import sys\nd = list(map(int, sys.stdin.read().split()))\nif len(d) >= 2: print(d[0] * 4 * d[1])`,
        solutionCodeCpp: `#include <iostream>\nusing namespace std;\nint main() {\n    long long K, A;\n    if (cin >> K >> A) cout << K * 4 * A << endl;\n    return 0;\n}`
      }
    ]
  },
  {
    id: "c1_ve_luoi",
    title: "Vẽ hình: Vẽ lưới ô vuông",
    level: "cap1",
    variations: [
      {
        subTitle: "Lưới ô vuông R hàng C cột",
        description: "Bạn Tèo muốn lập trình Scratch vẽ một lưới gồm ~R~ hàng và ~C~ cột ô vuông. Mỗi ô vuông nhỏ có chiều dài cạnh là ~A~ bước di chuyển. Hỏi tổng quãng đường vẽ thực tế ngắn nhất của mèo Scratch là bao nhiêu?",
        inputDesc: "Dòng duy nhất chứa ba số nguyên dương ~R~, ~C~ và ~A~.",
        outputDesc: "Quãng đường vẽ ngắn nhất.",
        subtasks: [{ id: 1, percent: 100, limit: "R, C, A \\le 1000", desc: "tổng độ dài lưới.", minVal: 2, maxVal: 1000 }],
        sampleTests: [{ input: "2 2 10", output: "120" }],
        generateInput: function(subtaskId) {
          return `${Math.floor(Math.random() * 20) + 2} ${Math.floor(Math.random() * 20) + 2} ${(Math.floor(Math.random() * 9) + 2) * 5}`;
        },
        solve: function(inputStr) {
          const parts = inputStr.trim().split(/\s+/).map(BigInt);
          return ((parts[0] + 1n) * parts[1] * parts[2] + (parts[1] + 1n) * parts[0] * parts[2]).toString();
        },
        solutionCodePython: `import sys\nparts = list(map(int, sys.stdin.read().split()))\nif len(parts) >= 3:\n    R, C, A = parts[0], parts[1], parts[2]\n    print((R + 1) * C * A + (C + 1) * R * A)`,
        solutionCodeCpp: `#include <iostream>\nusing namespace std;\nint main() {\n    long long R, C, A;\n    if (cin >> R >> C >> A) cout << (R + 1) * C * A + (C + 1) * R * A << endl;\n    return 0;\n}`
      }
    ]
  },
  {
    id: "c1_ve_sao",
    title: "Vẽ hình: Vẽ hình ngôi sao",
    level: "cap1",
    variations: [
      {
        subTitle: "Ngôi sao 5 cánh",
        description: "Vẽ ngôi sao 5 cánh có chiều dài mỗi nét là ~A~ bước. Hãy lập trình tính tổng quãng đường mèo di chuyển để vẽ xong ngôi sao 5 cánh này.",
        inputDesc: "Một số nguyên dương ~A~.",
        outputDesc: "Tổng quãng đường di chuyển vẽ ngôi sao.",
        subtasks: [{ id: 1, percent: 100, limit: "A \\le 1000", desc: "Tổng quãng đường = 5 * A.", minVal: 5, maxVal: 1000 }],
        sampleTests: [{ input: "100", output: "500" }],
        generateInput: function(subtaskId) { return (Math.floor(Math.random() * 500) + 10).toString(); },
        solve: function(inputStr) { return (BigInt(inputStr.trim()) * 5n).toString(); },
        solutionCodePython: `import sys\nfor line in sys.stdin:\n    if line.strip(): print(int(line.strip()) * 5)`,
        solutionCodeCpp: `#include <iostream>\nusing namespace std;\nint main() {\n    long long A;\n    if (cin >> A) cout << A * 5 << endl;\n    return 0;\n}`
      }
    ]
  },
  {
    id: "c1_tong_day",
    title: "Số học: Tổng dãy số cách đều",
    level: "cap1",
    variations: [
      {
        subTitle: "Dãy số cách đều bắt đầu từ 3",
        description: "Xét dãy số cách đều sau: ~3, 7, 11, 15, 19, \\dots~ Hãy tìm số thứ ~N~ của dãy và tính tổng của ~N~ số hạng đầu tiên.",
        inputDesc: "Một số nguyên dương ~N~.",
        outputDesc: "Ghi số thứ ~N~ và tổng ~N~ số đầu tiên cách nhau bởi khoảng trắng.",
        subtasks: [
          { id: 1, percent: 50, limit: "N \\le 1000", desc: "dùng vòng lặp cộng dồn.", minVal: 1, maxVal: 1000 },
          { id: 2, percent: 50, limit: "N \\le 10^9", desc: "công thức tính nhanh.", minVal: 1001, maxVal: 1000000000 }
        ],
        sampleTests: [{ input: "3", output: "11 21" }],
        generateInput: function(subtaskId) {
          const sub = this.subtasks.find(s => s.id === subtaskId);
          return (Math.floor(Math.random() * (sub.maxVal - sub.minVal + 1)) + sub.minVal).toString();
        },
        solve: function(inputStr) {
          const N = BigInt(inputStr.trim());
          const UN = 3n + (N - 1n) * 4n;
          const Sum = N * (3n + UN) / 2n;
          return `${UN} ${Sum}`;
        },
        solutionCodePython: `import sys\nfor line in sys.stdin:\n    if line.strip():\n        N = int(line.strip())\n        un = 3 + (N - 1) * 4\n        print(f"{un} {N * (3 + un) // 2}")`,
        solutionCodeCpp: `#include <iostream>\nusing namespace std;\nint main() {\n    long long N;\n    if (cin >> N) {\n        long long un = 3 + (N - 1) * 4;\n        cout << un << " " << N * (3 + un) / 2 << endl;\n    }\n    return 0;\n}`
      },
      {
        subTitle: "Dãy số chẵn lẻ có quy luật",
        description: "Xét dãy số cách đều sau: ~1, 3, 5, 7, 9, \\dots~ Hãy tính tổng ~N~ số hạng đầu tiên của dãy số lẻ này.",
        inputDesc: "Số nguyên dương ~N~.",
        outputDesc: "Một số nguyên duy nhất là tổng của dãy.",
        subtasks: [
          { id: 1, percent: 50, limit: "N \\le 1000", desc: "dùng vòng lặp.", minVal: 1, maxVal: 1000 },
          { id: 2, percent: 50, limit: "N \\le 10^9", desc: "áp dụng công thức ~N^2~.", minVal: 1001, maxVal: 1000000000 }
        ],
        sampleTests: [{ input: "4", output: "16", explain: "1 + 3 + 5 + 7 = 16." }],
        generateInput: function(subtaskId) {
          const sub = this.subtasks.find(s => s.id === subtaskId);
          return (Math.floor(Math.random() * (sub.maxVal - sub.minVal + 1)) + sub.minVal).toString();
        },
        solve: function(inputStr) {
          const N = BigInt(inputStr.trim());
          return (N * N).toString();
        },
        solutionCodePython: `import sys\nfor line in sys.stdin:\n    if line.strip():\n        N = int(line.strip())\n        print(N * N)`,
        solutionCodeCpp: `#include <iostream>\nusing namespace std;\nint main() {\n    long long N;\n    if (cin >> N) cout << N * N << endl;\n    return 0;\n}`
      }
    ]
  },
  {
    id: "c1_dem_so_chia_het",
    title: "Số học: Đếm số chia hết",
    level: "cap1",
    variations: [
      {
        subTitle: "Đếm số chia hết cho D",
        description: "Cho ba số nguyên dương ~L~, ~R~ và ~D~. Bạn hãy tìm số lượng các số nguyên nằm trong đoạn từ ~L~ đến ~R~ chia hết cho số ~D~.",
        inputDesc: "Một dòng chứa ba số nguyên dương ~L~, ~R~ và ~D~ cách nhau bởi dấu cách.",
        outputDesc: "Số lượng số chia hết cho ~D~.",
        subtasks: [
          { id: 1, percent: 50, limit: "L \\le R \\le 1000", desc: "duyệt vòng lặp kiểm tra.", minVal: 1, maxVal: 1000 },
          { id: 2, percent: 50, limit: "L \\le R \\le 10^9", desc: "thuật toán O(1) toán học.", minVal: 1001, maxVal: 1000000000 }
        ],
        sampleTests: [{ input: "1 10 3", output: "3" }],
        generateInput: function(subtaskId) {
          const sub = this.subtasks.find(s => s.id === subtaskId);
          const D = Math.floor(Math.random() * 8) + 2;
          const L = Math.floor(Math.random() * (sub.maxVal / 5)) + 1;
          const R = L + Math.floor(Math.random() * (sub.maxVal / 2)) + 10;
          return `${L} ${R} ${D}`;
        },
        solve: function(inputStr) {
          const parts = inputStr.trim().split(/\s+/).map(BigInt);
          return (parts[1] / parts[2] - (parts[0] - 1n) / parts[2]).toString();
        },
        solutionCodePython: `import sys\ndata = list(map(int, sys.stdin.read().split()))\nif len(data) >= 3:\n    print(data[1] // data[2] - (data[0] - 1) // data[2])`,
        solutionCodeCpp: `#include <iostream>\nusing namespace std;\nint main() {\n    long long L, R, D;\n    if (cin >> L >> R >> D) cout << R / D - (L - 1) / D << endl;\n    return 0;\n}`
      },
      {
        subTitle: "Đếm số chia hết cho cả A và B",
        description: "Cho hai số giới hạn ~L~, ~R~ và hai số chia ~A~, ~B~. Hãy đếm xem có bao nhiêu số trong đoạn ~[L, R]~ chia hết cho cả ~A~ và ~B~.",
        inputDesc: "Một dòng chứa bốn số nguyên dương ~L~, ~R~, ~A~, ~B~ cách nhau bởi dấu cách.",
        outputDesc: "Số lượng số chia hết cho cả ~A~ và ~B~ (chia hết cho BCNN của A và B).",
        subtasks: [
          { id: 1, percent: 50, limit: "L \\le R \\le 1000", desc: "duyệt qua từng số.", minVal: 1, maxVal: 1000 },
          { id: 2, percent: 50, limit: "L \\le R \\le 10^9", desc: "dùng công thức toán học và tìm BCNN.", minVal: 1001, maxVal: 1000000000 }
        ],
        sampleTests: [{ input: "1 20 2 3", output: "3", explain: "Các số chia hết cho cả 2 và 3 (tức là chia hết cho 6) là: 6, 12, 18." }],
        generateInput: function(subtaskId) {
          const sub = this.subtasks.find(s => s.id === subtaskId);
          const A = Math.floor(Math.random() * 4) + 2;
          const B = Math.floor(Math.random() * 4) + 2;
          const L = Math.floor(Math.random() * (sub.maxVal / 5)) + 1;
          const R = L + Math.floor(Math.random() * (sub.maxVal / 2)) + 10;
          return `${L} ${R} ${A} ${B}`;
        },
        solve: function(inputStr) {
          const parts = inputStr.trim().split(/\s+/).map(BigInt);
          const L = parts[0], R = parts[1], A = parts[2], B = parts[3];
          function gcd(x, y) { return y === 0n ? x : gcd(y, x % y); }
          const lcm = (A * B) / gcd(A, B);
          return (R / lcm - (L - 1n) / lcm).toString();
        },
        solutionCodePython: `import sys, math\nd = list(map(int, sys.stdin.read().split()))\nif len(d) >= 4:\n    L, R, A, B = d[0], d[1], d[2], d[3]\n    lcm = (A * B) // math.gcd(A, B)\n    print(R // lcm - (L - 1) // lcm)`,
        solutionCodeCpp: `#include <iostream>\n#include <numeric>\nusing namespace std;\nlong long gcd(long long a, long long b) { return b == 0 ? a : gcd(b, a % b); }\nlong long lcm(long long a, long long b) { return (a * b) / gcd(a, b); }\nint main() {\n    long long L, R, A, B;\n    if (cin >> L >> R >> A >> B) {\n        long long val = lcm(A, B);\n        cout << R / val - (L - 1) / val << endl;\n    }\n    return 0;\n}`
      }
    ]
  },
  {
    id: "c1_ucln",
    title: "Số học: Ước chung lớn nhất",
    level: "cap1",
    variations: [
      {
        subTitle: "Ước chung lớn nhất",
        description: "Nhập hai số nguyên dương ~A~ và ~B~. Hãy tìm ước chung lớn nhất của ~A~ và ~B~.",
        inputDesc: "Hai số nguyên dương ~A~ và ~B~ cách nhau bởi khoảng trắng.",
        outputDesc: "Một số nguyên duy nhất là UCLN.",
        subtasks: [
          { id: 1, percent: 50, limit: "A, B \\le 10^5", desc: "duyệt tìm ước số chung.", minVal: 1, maxVal: 100000 },
          { id: 2, percent: 50, limit: "A, B \\le 10^9", desc: "thuật toán tối ưu Euclid.", minVal: 100001, maxVal: 1000000000 }
        ],
        sampleTests: [{ input: "12 18", output: "6" }],
        generateInput: function(subtaskId) {
          const sub = this.subtasks.find(s => s.id === subtaskId);
          return `${Math.floor(Math.random() * (sub.maxVal - sub.minVal)) + sub.minVal} ${Math.floor(Math.random() * (sub.maxVal - sub.minVal)) + sub.minVal}`;
        },
        solve: function(inputStr) {
          const parts = inputStr.trim().split(/\s+/).map(BigInt);
          let x = parts[0], y = parts[1];
          while (y !== 0n) { let t = y; y = x % y; x = t; }
          return x.toString();
        },
        solutionCodePython: `import sys, math\ndata = list(map(int, sys.stdin.read().split()))\nif len(data) >= 2: print(math.gcd(data[0], data[1]))`,
        solutionCodeCpp: `#include <iostream>\nusing namespace std;\nlong long gcd(long long a, long long b) { return b == 0 ? a : gcd(b, a % b); }\nint main() {\n    long long a, b;\n    if (cin >> a >> b) cout << gcd(a, b) << endl;\n    return 0;\n}`
      }
    ]
  },
  {
    id: "c1_snt",
    title: "Số học: Kiểm tra số nguyên tố",
    level: "cap1",
    variations: [
      {
        subTitle: "Kiểm tra số nguyên tố",
        description: "Nhập số nguyên dương ~N~. Kiểm tra xem ~N~ có phải số nguyên tố không.",
        inputDesc: "Một số nguyên dương ~N~.",
        outputDesc: "YES nếu đúng, ngược lại NO.",
        subtasks: [
          { id: 1, percent: 50, limit: "N \\le 1000", desc: "chia thử cơ bản.", minVal: 1, maxVal: 1000 },
          { id: 2, percent: 50, limit: "N \\le 10^9", desc: "vòng lặp đến căn bậc hai.", minVal: 1001, maxVal: 1000000000 }
        ],
        sampleTests: [{ input: "7", output: "YES" }],
        generateInput: function(subtaskId) {
          const sub = this.subtasks.find(s => s.id === subtaskId);
          return (Math.floor(Math.random() * (sub.maxVal - sub.minVal + 1)) + sub.minVal).toString();
        },
        solve: function(inputStr) {
          const N = parseInt(inputStr.trim());
          if (N < 2) return "NO";
          for (let i = 2; i * i <= N; i++) if (N % i === 0) return "NO";
          return "YES";
        },
        solutionCodePython: `import sys\ndef is_prime(n):\n    if n < 2: return False\n    for i in range(2, int(n**0.5)+1):\n        if n % i == 0: return False\n    return True\nline = sys.stdin.read().strip()\nif line: print("YES" if is_prime(int(line)) else "NO")`,
        solutionCodeCpp: `#include <iostream>\nusing namespace std;\nbool isPrime(long long n) {\n    if (n < 2) return false;\n    for (long long i = 2; i * i <= n; i++) if (n % i == 0) return false;\n    return true;\n}\nint main() {\n    long long n;\n    if (cin >> n) cout << (isPrime(n) ? "YES" : "NO") << endl;\n    return 0;\n}`
      }
    ]
  },
  {
    id: "c1_so_doi_xung",
    title: "Số học: Số đối xứng",
    level: "cap1",
    variations: [
      {
        subTitle: "Kiểm tra số đối xứng",
        description: "Kiểm tra ~N~ có đối xứng hay không.",
        inputDesc: "Một số nguyên dương ~N~.",
        outputDesc: "YES hoặc NO.",
        subtasks: [{ id: 1, percent: 100, limit: "N \\le 10^{18}", desc: "kiểm tra xâu.", minVal: 10, maxVal: 1000000000000000000 }],
        sampleTests: [{ input: "12321", output: "YES" }],
        generateInput: function(subtaskId) {
          if (Math.random() < 0.5) {
            let s = (Math.floor(Math.random() * 90000) + 1000).toString();
            return s + s.split("").reverse().join("");
          }
          return (Math.floor(Math.random() * 900000000) + 10).toString();
        },
        solve: function(inputStr) {
          const s = inputStr.trim();
          return s === s.split("").reverse().join("") ? "YES" : "NO";
        },
        solutionCodePython: `import sys\nline = sys.stdin.read().strip()\nif line: print("YES" if line == line[::-1] else "NO")`,
        solutionCodeCpp: `#include <iostream>\n#include <string>\n#include <algorithm>\nusing namespace std;\nint main() {\n    string s; if (cin >> s) {\n        string r = s; reverse(r.begin(), r.end());\n        cout << (s == r ? "YES" : "NO") << endl;\n    }\n    return 0;\n}`
      }
    ]
  },
  {
    id: "c1_so_chinh_phuong",
    title: "Số học: Số chính phương",
    level: "cap1",
    variations: [
      {
        subTitle: "Đếm số chính phương trong đoạn",
        description: "Cho hai số nguyên dương ~A~ và ~B~. Hãy đếm xem có bao nhiêu số chính phương trong đoạn ~[A, B]~.",
        inputDesc: "Một dòng chứa hai số nguyên dương ~A~ và ~B~.",
        outputDesc: "Một số nguyên duy nhất là số lượng số chính phương.",
        subtasks: [
          { id: 1, percent: 50, limit: "A \\le B \\le 10^5", desc: "duyệt kiểm tra.", minVal: 1, maxVal: 100000 },
          { id: 2, percent: 50, limit: "A \\le B \\le 10^{12}", desc: "tối ưu bằng căn bậc hai.", minVal: 100001, maxVal: 1000000000000 }
        ],
        sampleTests: [{ input: "1 10", output: "3" }],
        generateInput: function(subtaskId) {
          const sub = this.subtasks.find(s => s.id === subtaskId);
          let A = Math.floor(Math.random() * (sub.maxVal / 10)) + 1;
          let B = A + Math.floor(Math.random() * (sub.maxVal / 2)) + 100;
          return `${A} ${B}`;
        },
        solve: function(inputStr) {
          const parts = inputStr.trim().split(/\s+/).map(BigInt);
          function isqrt(value) {
            if (value < 0n) return 0n;
            if (value < 2n) return value;
            let x0 = value / 2n;
            let x1 = (x0 + value / x0) / 2n;
            while (x1 < x0) { x0 = x1; x1 = (x0 + value / x0) / 2n; }
            return x0;
          }
          return (isqrt(parts[1]) - isqrt(parts[0] - 1n)).toString();
        },
        solutionCodePython: `import sys, math\nd = list(map(int, sys.stdin.read().split()))\nif len(d) >= 2:\n    print(math.isqrt(d[1]) - math.isqrt(d[0] - 1))`,
        solutionCodeCpp: `#include <iostream>\n#include <cmath>\nusing namespace std;\nint main() {\n    long long A, B;\n    if (cin >> A >> B) cout << (long long)sqrt(B) - (long long)sqrt(A - 1) << endl;\n    return 0;\n}`
      }
    ]
  },
  {
    id: "c1_tong_chu_so",
    title: "Số học: Tổng các chữ số",
    level: "cap1",
    variations: [
      {
        subTitle: "Tổng tất cả chữ số",
        description: "Cho số nguyên dương ~N~. Lập trình tính tổng các chữ số của ~N~.",
        inputDesc: "Một dòng chứa ~N~.",
        outputDesc: "Một số nguyên duy nhất.",
        subtasks: [{ id: 1, percent: 100, limit: "N \\le 10^{100}", desc: "duyệt chữ số.", minVal: 10, maxVal: 100000 }],
        sampleTests: [{ input: "1234", output: "10" }],
        generateInput: function(subtaskId) {
          let res = ""; for (let i = 0; i < 20; i++) res += Math.floor(Math.random() * 10).toString();
          if (res.startsWith("0")) res = "9" + res.substring(1);
          return res;
        },
        solve: function(inputStr) {
          let s = inputStr.trim(), sum = 0;
          for (let i = 0; i < s.length; i++) {
            let code = s.charCodeAt(i);
            if (code >= 48 && code <= 57) sum += (code - 48);
          }
          return sum.toString();
        },
        solutionCodePython: `import sys\nprint(sum(int(c) for c in sys.stdin.read().strip() if c.isdigit()))`,
        solutionCodeCpp: `#include <iostream>\n#include <string>\nusing namespace std;\nint main() {\n    string s; int sum = 0;\n    if (cin >> s) {\n        for (char c : s) if (isdigit(c)) sum += c - '0';\n        cout << sum << endl;\n    }\n    return 0;\n}`
      }
    ]
  },
  {
    id: "c1_toan_co_ga_cho",
    title: "Toán cổ: Gà và Chó",
    level: "cap1",
    variations: [
      {
        subTitle: "Giải bài toán Gà và Chó",
        description: "Tìm số lượng Gà và Chó khi biết tổng số con là ~C~ và tổng số chân là ~P~.",
        inputDesc: "C và P cách nhau bởi khoảng trắng.",
        outputDesc: "Số gà và số chó.",
        subtasks: [{ id: 1, percent: 100, limit: "C \\le 10^6", desc: "giải hệ bậc nhất.", minVal: 1, maxVal: 1000000 }],
        sampleTests: [{ input: "36 100", output: "22 14" }],
        generateInput: function(subtaskId) {
          const dog = Math.floor(Math.random() * 20000) + 1;
          const chicken = Math.floor(Math.random() * 30000) + 1;
          return `${dog + chicken} ${dog * 4 + chicken * 2}`;
        },
        solve: function(inputStr) {
          const parts = inputStr.trim().split(/\s+/).map(BigInt);
          const C = parts[0], P = parts[1];
          if (P % 2n !== 0n) return "-1";
          const dog2 = P - 2n * C;
          if (dog2 < 0n || dog2 % 2n !== 0n) return "-1";
          const dog = dog2 / 2n;
          const chicken = C - dog;
          return chicken < 0n ? "-1" : `${chicken} ${dog}`;
        },
        solutionCodePython: `import sys\nd = list(map(int, sys.stdin.read().split()))\nif len(d) >= 2:\n    C, P = d[0], d[1]\n    if P % 2 != 0 or P < 2*C or P > 4*C: print("-1")\n    else:\n        dog = (P - 2*C) // 2\n        print(f"{C - dog} {dog}")`,
        solutionCodeCpp: `#include <iostream>\nusing namespace std;\nint main() {\n    long long C, P;\n    if (cin >> C >> P) {\n        if (P % 2 != 0 || P < 2 * C || P > 4 * C) cout << -1 << endl;\n        else {\n            long long dog = (P - 2 * C) / 2;\n            cout << C - dog << " " << dog << endl;\n        }\n    }\n    return 0;\n}`
      }
    ]
  },
  {
    id: "c1_tong_hieu",
    title: "Toán học: Tổng và Hiệu",
    level: "cap1",
    variations: [
      {
        subTitle: "Tìm hai số",
        description: "Nhập tổng ~S~ và hiệu ~D~ của hai số nguyên. Hãy tìm hai số đó.",
        inputDesc: "Tổng ~S~ và hiệu ~D~.",
        outputDesc: "Số lớn và số bé.",
        subtasks: [{ id: 1, percent: 100, limit: "S, D \\le 10^{15}", desc: "giải hệ.", minVal: 1, maxVal: 1000000000000000 }],
        sampleTests: [{ input: "10 4", output: "7 3" }],
        generateInput: function(subtaskId) {
          const num1 = Math.floor(Math.random() * 100000000) + 100;
          const num2 = num1 + Math.floor(Math.random() * 50000000) + 10;
          return `${num1 + num2} ${num2 - num1}`;
        },
        solve: function(inputStr) {
          const parts = inputStr.trim().split(/\s+/).map(BigInt);
          if ((parts[0] + parts[1]) % 2n !== 0n) return "-1";
          const big = (parts[0] + parts[1]) / 2n;
          return `${big} ${parts[0] - big}`;
        },
        solutionCodePython: `import sys\nd = list(map(int, sys.stdin.read().split()))\nif len(d) >= 2:\n    S, D = d[0], d[1]\n    if (S + D) % 2 != 0: print("-1")\n    else: print(f"{(S + D) // 2} {S - (S + D) // 2}")`,
        solutionCodeCpp: `#include <iostream>\nusing namespace std;\nint main() {\n    long long S, D;\n    if (cin >> S >> D) {\n        if ((S + D) % 2 != 0) cout << -1 << endl;\n        else {\n            long long big = (S + D) / 2;\n            cout << big << " " << S - big << endl;\n        }\n    }\n    return 0;\n}`
      }
    ]
  },
  {
    id: "c1_max_list",
    title: "Danh sách: Giá trị lớn nhất",
    level: "cap1",
    variations: [
      {
        subTitle: "Số lớn nhất trong dãy",
        description: "Nhập danh sách gồm ~N~ số nguyên. Tìm giá trị lớn nhất.",
        inputDesc: "N và dãy số nguyên.",
        outputDesc: "Số lớn nhất.",
        subtasks: [{ id: 1, percent: 100, limit: "N \\le 10^5", desc: "duyệt tìm max.", minVal: 5, maxVal: 50000 }],
        sampleTests: [{ input: "5\n1 5 3 9 2", output: "9" }],
        generateInput: function(subtaskId) {
          const N = Math.floor(Math.random() * 50) + 10;
          const arr = Array.from({ length: N }, () => Math.floor(Math.random() * 1000) - 500);
          return `${N}\n${arr.join(" ")}`;
        },
        solve: function(inputStr) {
          const lines = inputStr.trim().split("\n");
          const arr = lines[1].trim().split(/\s+/).map(Number);
          return Math.max(...arr).toString();
        },
        solutionCodePython: `import sys\nlines = sys.stdin.read().split()\nif len(lines) > 1: print(max(map(int, lines[1:])))`,
        solutionCodeCpp: `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main() {\n    int n; if (cin >> n) {\n        long long val, mx = -2e18;\n        for (int i=0; i<n; i++) { cin >> val; mx = max(mx, val); }\n        cout << mx << endl;\n    }\n    return 0;\n}`
      }
    ]
  },
  {
    id: "c1_chan_le_list",
    title: "Danh sách: Đếm chẵn lẻ",
    level: "cap1",
    variations: [
      {
        subTitle: "Đếm số lượng số chẵn và số lẻ",
        description: "Nhập danh sách ~N~ số nguyên dương. Đếm chẵn và lẻ.",
        inputDesc: "N và mảng số.",
        outputDesc: "Số lượng số chẵn và lẻ.",
        subtasks: [{ id: 1, percent: 100, limit: "N \\le 10^5", desc: "duyệt đếm.", minVal: 5, maxVal: 50000 }],
        sampleTests: [{ input: "5\n1 2 3 4 5", output: "2 3" }],
        generateInput: function(subtaskId) {
          const N = Math.floor(Math.random() * 50) + 10;
          const arr = Array.from({ length: N }, () => Math.floor(Math.random() * 100) + 1);
          return `${N}\n${arr.join(" ")}`;
        },
        solve: function(inputStr) {
          const lines = inputStr.trim().split("\n");
          const arr = lines[1].trim().split(/\s+/).map(Number);
          let even = 0; arr.forEach(x => { if (x % 2 === 0) even++; });
          return `${even} ${arr.length - even}`;
        },
        solutionCodePython: `import sys\nlines = sys.stdin.read().split()\nif len(lines) > 1:\n    arr = list(map(int, lines[1:]))\n    even = sum(1 for x in arr if x % 2 == 0)\n    print(f"{even} {len(arr) - even}")`,
        solutionCodeCpp: `#include <iostream>\nusing namespace std;\nint main() {\n    int n; if (cin >> n) {\n        int x, even = 0, odd = 0;\n        for(int i=0; i<n; i++) { cin >> x; if (x%2==0) even++; else odd++; }\n        cout << even << " " << odd << endl;\n    }\n    return 0;\n}`
      }
    ]
  },
  {
    id: "c1_tbc_list",
    title: "Danh sách: Trung bình cộng",
    level: "cap1",
    variations: [
      {
        subTitle: "Tính trung bình cộng các số chia hết cho 3",
        description: "Cho danh sách gồm ~N~ số nguyên dương. Tính trung bình cộng của các số trong danh sách chia hết cho ~3~. Kết quả làm tròn đến hai chữ số thập phân.",
        inputDesc: "N và mảng số.",
        outputDesc: "Giá trị trung bình cộng.",
        subtasks: [{ id: 1, percent: 100, limit: "N \\le 10^5", desc: "duyệt và cộng dồn.", minVal: 5, maxVal: 50000 }],
        sampleTests: [{ input: "5\n3 4 6 8 9", output: "6.00" }],
        generateInput: function(subtaskId) {
          const N = Math.floor(Math.random() * 50) + 10;
          const arr = Array.from({ length: N }, () => Math.floor(Math.random() * 100) + 1);
          return `${N}\n${arr.join(" ")}`;
        },
        solve: function(inputStr) {
          const lines = inputStr.trim().split("\n");
          const arr = lines[1].trim().split(/\s+/).map(Number);
          let sum = 0, count = 0;
          arr.forEach(x => { if (x % 3 === 0) { sum += x; count++; } });
          if (count === 0) return "-1";
          return (sum / count).toFixed(2);
        },
        solutionCodePython: `import sys\nlines = sys.stdin.read().split()\nif len(lines) > 1:\n    arr = [int(x) for x in lines[1:] if int(x) % 3 == 0]\n    if not arr: print("-1")\n    else: print(f"{sum(arr)/len(arr):.2f}")`,
        solutionCodeCpp: `#include <iostream>\n#include <iomanip>\nusing namespace std;\nint main() {\n    int n; if (cin >> n) {\n        long long x, sum = 0, cnt = 0;\n        for (int i=0; i<n; i++) { cin >> x; if (x%3==0) { sum += x; cnt++; } }\n        if (cnt == 0) cout << -1 << endl;\n        else cout << fixed << setprecision(2) << (double)sum / cnt << endl;\n    }\n    return 0;\n}`
      }
    ]
  },

  // ==================== CẤP 2 (THCS - C++ & PYTHON) ====================
  {
    id: "c2_tong_uoc_le",
    title: "Số học: Tổng ước số lẻ lớn nhất (Cấp 2)",
    level: "cap2",
    variations: [
      {
        subTitle: "Tính tổng f(i)",
        description: "Với mỗi số nguyên dương ~i~, hãy tìm ước số lẻ lớn nhất của nó, ký hiệu là ~f(i)~. Hãy tính tổng tất cả các giá trị ~f(i)~ với ~i~ chạy từ ~1~ đến ~N~, chia lấy dư cho ~10^9+7~.",
        inputDesc: "Một số nguyên dương ~N~.",
        outputDesc: "Kết quả chia lấy dư cho ~10^9+7~.",
        subtasks: [
          { id: 1, percent: 40, limit: "N \\le 10^6", desc: "duyệt tuyến tính.", minVal: 1, maxVal: 1000000 },
          { id: 2, percent: 30, limit: "N \\le 10^9", desc: "thuật toán tối ưu tuyến tính.", minVal: 1000001, maxVal: 1000000000 },
          { id: 3, percent: 30, limit: "N \\le 10^{18}", desc: "yêu cầu thuật toán toán học tối ưu O(log N).", minVal: 1000000001, maxVal: 1000000000000000000 }
        ],
        sampleTests: [{ input: "5", output: "11" }],
        generateInput: function(subtaskId) {
          const sub = this.subtasks.find(s => s.id === subtaskId);
          if (subtaskId === 1) return Math.floor(Math.random() * 100000).toString();
          if (subtaskId === 2) return Math.floor(Math.random() * 100000000).toString();
          const min = BigInt(sub.minVal);
          const max = BigInt(sub.maxVal);
          return (min + (BigInt(Math.floor(Math.random() * 1000000000)) % (max - min))).toString();
        },
        solve: function(inputStr) {
          const N = BigInt(inputStr.trim());
          const MOD = 1000000007n;
          function sumOddDivisors(n) {
            if (n === 0n) return 0n;
            let k = (n + 1n) / 2n;
            let oddSum = (k * k) % MOD;
            return (oddSum + sumOddDivisors(n / 2n)) % MOD;
          }
          return sumOddDivisors(N).toString();
        },
        solutionCodePython: `def solve(n):\n    MOD = 10**9 + 7\n    def S(n):\n        if n == 0: return 0\n        k = (n + 1) // 2\n        return ((k*k)%MOD + S(n//2)) % MOD\n    return S(n)\nimport sys\nfor line in sys.stdin:\n    if line.strip(): print(solve(int(line.strip())))`,
        solutionCodeCpp: `#include <iostream>\nusing namespace std;\nconst long long MOD = 1000000007;\nlong long solve(long long n) {\n    if (n == 0) return 0;\n    long long k = (n + 1) / 2; k %= MOD;\n    return ((k * k) % MOD + solve(n / 2)) % MOD;\n}\nint main() { long long n; if (cin >> n) cout << solve(n) << endl; return 0; }`
      }
    ]
  },
  {
    id: "c2_sieu_nguyen_to",
    title: "Số học: Số siêu nguyên tố nhỏ hơn N",
    level: "cap2",
    variations: [
      {
        subTitle: "Siêu nguyên tố",
        description: "Đếm số siêu nguyên tố (prime numbers where any prefix is also prime) nhỏ hơn hoặc bằng ~N~.",
        inputDesc: "Một số nguyên dương ~N~.",
        outputDesc: "Một số nguyên duy nhất.",
        subtasks: [
          { id: 1, percent: 50, limit: "N \\le 10^5", desc: "thuật toán kiểm tra từng số.", minVal: 10, maxVal: 100000 },
          { id: 2, percent: 50, limit: "N \\le 10^9", desc: "thuật toán tạo siêu nguyên tố bằng quay lui.", minVal: 100001, maxVal: 1000000000 }
        ],
        sampleTests: [{ input: "30", output: "6" }],
        generateInput: function(subtaskId) {
          const sub = this.subtasks.find(s => s.id === subtaskId);
          return (Math.floor(Math.random() * (sub.maxVal - sub.minVal + 1)) + sub.minVal).toString();
        },
        solve: function(inputStr) {
          const N = parseInt(inputStr.trim());
          function isPrime(num) {
            if (num < 2) return false;
            for (let i = 2; i * i <= num; i++) if (num % i === 0) return false;
            return true;
          }
          let count = 0;
          function generate(curr) {
            if (curr > N) return;
            if (isPrime(curr)) {
              count++;
              for (let digit of [1, 3, 7, 9]) generate(curr * 10 + digit);
            }
          }
          for (let p of [2, 3, 5, 7]) generate(p);
          return count.toString();
        },
        solutionCodePython: `def is_prime(num):\n    if num < 2: return False\n    for i in range(2, int(num**0.5)+1): \n        if num % i == 0: return False\n    return True\ndef solve(N):\n    cnt = 0\n    def gen(curr):\n        nonlocal cnt\n        if curr > N: return\n        if is_prime(curr):\n            cnt += 1\n            for d in [1, 3, 7, 9]: gen(curr * 10 + d)\n    for p in [2, 3, 5, 7]: gen(p)\n    return cnt\nimport sys\nfor line in sys.stdin:\n    if line.strip(): print(solve(int(line.strip())))`,
        solutionCodeCpp: `#include <iostream>\nusing namespace std;\nbool isPrime(long long n) {\n    if (n < 2) return false;\n    for (long long i=2; i*i<=n; ++i) if (n%i==0) return false;\n    return true;\n}\nlong long N, cnt = 0;\nvoid gen(long long curr) {\n    if (curr > N) return;\n    if (isPrime(curr)) {\n        cnt++;\n        long long ds[] = {1, 3, 7, 9};\n        for (int i=0; i<4; i++) gen(curr * 10 + ds[i]);\n    }\n}\nint main() { if (cin >> N) { for(int p : {2,3,5,7}) gen(p); cout << cnt << endl; } return 0; }`
      }
    ]
  },
  {
    id: "c2_phan_tich_snt",
    title: "Số học: Phân tích thừa số nguyên tố",
    level: "cap2",
    variations: [
      {
        subTitle: "Phân tích lũy thừa",
        description: "Viết chương trình phân tích số nguyên dương ~N~ thành các thừa số nguyên tố theo định dạng tích lũy thừa (ví dụ: ~12 = 2^2 * 3^1~).",
        inputDesc: "Một số nguyên dương ~N~.",
        outputDesc: "Kết quả có dạng ~p_1^a_1 * p_2^a_2 * ... * p_k^a_k~.",
        subtasks: [{ id: 1, percent: 100, limit: "N \\le 10^{12}", desc: "tối ưu phân tích thừa số.", minVal: 2, maxVal: 1000000000000 }],
        sampleTests: [{ input: "60", output: "2^2 * 3^1 * 5^1" }],
        generateInput: function(subtaskId) {
          return (Math.floor(Math.random() * 100000000) + 100).toString();
        },
        solve: function(inputStr) {
          let N = BigInt(inputStr.trim());
          let res = []; let div = 2n;
          while (div * div <= N) {
            if (N % div === 0n) {
              let count = 0;
              while (N % div === 0n) { count++; N /= div; }
              res.push(`${div}^${count}`);
            }
            div++;
          }
          if (N > 1n) res.push(`${N}^1`);
          return res.join(" * ");
        },
        solutionCodePython: `import sys\ndef solve(n):\n    res = []\n    d = 2\n    while d * d <= n:\n        if n % d == 0:\n            c = 0\n            while n % d == 0: c += 1; n //= d\n            res.append(f"{d}^{c}")\n        d += 1\n    if n > 1: res.append(f"{n}^1")\n    return " * ".join(res)\nline = sys.stdin.read().strip()\nif line: print(solve(int(line)))`,
        solutionCodeCpp: `#include <iostream>\n#include <vector>\n#include <string>\nusing namespace std;\nint main() {\n    long long n;\n    if (cin >> n) {\n        vector<string> res;\n        for (long long d = 2; d * d <= n; ++d) {\n            if (n % d == 0) {\n                int c = 0;\n                while (n % d == 0) { c++; n /= d; }\n                res.push_back(to_string(d) + "^" + to_string(c));\n            }\n        }\n        if (n > 1) res.push_back(to_string(n) + "^1");\n        for (int i=0; i<res.size(); i++) cout << res[i] << (i == res.size()-1 ? "" : " * ");\n        cout << endl;\n    }\n    return 0;\n}`
      }
    ]
  },
  {
    id: "c2_fibonacci",
    title: "Số học: Dãy số Fibonacci",
    level: "cap2",
    variations: [
      {
        subTitle: "Tìm số hạng thứ N của dãy Fibonacci",
        description: "Tìm ~F_N \\pmod{10^9+7}~.",
        inputDesc: "Số nguyên dương ~N~.",
        outputDesc: "Số F_N chia dư cho 10^9+7.",
        subtasks: [
          { id: 1, percent: 50, limit: "N \\le 10^7", desc: "DP tuyến tính O(N).", minVal: 1, maxVal: 1000000 },
          { id: 2, percent: 50, limit: "N \\le 10^{18}", desc: "nhân ma trận O(log N).", minVal: 1000001, maxVal: 1000000000000000000 }
        ],
        sampleTests: [{ input: "5", output: "5" }],
        generateInput: function(subtaskId) {
          const sub = this.subtasks.find(s => s.id === subtaskId);
          if (subtaskId === 1) return Math.floor(Math.random() * 100000).toString();
          const min = BigInt(sub.minVal);
          const max = BigInt(sub.maxVal);
          return (min + (BigInt(Math.floor(Math.random() * 1000000000)) % (max - min))).toString();
        },
        solve: function(inputStr) {
          const n = BigInt(inputStr.trim());
          const MOD = 1000000007n;
          function multiply(A, B) {
            let C = [[0n, 0n], [0n, 0n]];
            for (let i = 0; i < 2; i++) {
              for (let j = 0; j < 2; j++) {
                for (let k = 0; k < 2; k++) C[i][j] = (C[i][j] + A[i][k] * B[k][j]) % MOD;
              }
            }
            return C;
          }
          function power(A, p) {
            let res = [[1n, 0n], [0n, 1n]];
            while (p > 0n) {
              if (p % 2n === 1n) res = multiply(res, A);
              A = multiply(A, A); p /= 2n;
            }
            return res;
          }
          if (n === 0n) return "0";
          let T = [[1n, 1n], [1n, 0n]];
          T = power(T, n - 1n);
          return T[0][0].toString();
        },
        solutionCodePython: `def mul(A, B, MOD):\n    C = [[0,0],[0,0]]\n    for i in range(2):\n        for j in range(2):\n            for k in range(2): C[i][j] = (C[i][j] + A[i][k]*B[k][j]) % MOD\n    return C\ndef power(A, p, MOD):\n    res = [[1,0],[0,1]]\n    while p > 0:\n        if p % 2 == 1: res = mul(res, A, MOD)\n        A = mul(A, A, MOD); p //= 2\n    return res\nimport sys\nfor line in sys.stdin:\n    if line.strip():\n        N = int(line.strip())\n        if N == 0: print(0)\n        else:\n            T = [[1,1],[1,0]]\n            T = power(T, N-1, 1000000007)\n            print(T[0][0])`,
        solutionCodeCpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nconst long long MOD = 1000000007;\ntypedef vector<vector<long long>> matrix;\nmatrix multiply(matrix A, matrix B) {\n    matrix C(2, vector<long long>(2, 0));\n    for(int i=0; i<2; ++i) for(int j=0; j<2; ++j) for(int k=0; k<2; ++k)\n        C[i][j] = (C[i][j] + A[i][k] * B[k][j]) % MOD;\n    return C;\n}\nmatrix power(matrix A, long long p) {\n    matrix res = {{1,0},{0,1}};\n    while(p > 0) {\n        if (p % 2 == 1) res = multiply(res, A);\n        A = multiply(A, A); p /= 2;\n    }\n    return res;\n}\nint main() {\n    long long n; if (cin >> n) {\n        if (n == 0) cout << 0 << endl;\n        else { matrix T = {{1,1},{1,0}}; T = power(T, n-1); cout << T[0][0] << endl; }\n    }\n    return 0;\n}`
      }
    ]
  },
  {
    id: "c2_dem_uoc",
    title: "Số học: Đếm ước số của một số nguyên",
    level: "cap2",
    variations: [
      {
        subTitle: "Đếm ước số",
        description: "Cho số nguyên dương ~N~. Đếm xem ~N~ có bao nhiêu ước số nguyên dương.",
        inputDesc: "Một số nguyên dương ~N~.",
        outputDesc: "Số lượng ước số.",
        subtasks: [{ id: 1, percent: 100, limit: "N \\le 10^{12}", desc: "chỉ cần lặp đến căn bậc hai.", minVal: 1, maxVal: 1000000000000 }],
        sampleTests: [{ input: "12", output: "6" }],
        generateInput: function(subtaskId) { return (Math.floor(Math.random() * 10000000) + 5).toString(); },
        solve: function(inputStr) {
          const N = BigInt(inputStr.trim());
          let count = 0n, i = 1n;
          while (i * i <= N) {
            if (N % i === 0n) { count++; if (i * i !== N) count++; }
            i++;
          }
          return count.toString();
        },
        solutionCodePython: `import sys\nline = sys.stdin.read().strip()\nif line:\n    n = int(line)\n    cnt = 0\n    for i in range(1, int(n**0.5)+1):\n        if n % i == 0:\n            cnt += 1\n            if i*i != n: cnt += 1\n    print(cnt)`,
        solutionCodeCpp: `#include <iostream>\nusing namespace std;\nint main() {\n    long long n; if (cin >> n) {\n        long long cnt = 0;\n        for (long long i = 1; i * i <= n; i++) {\n            if (n % i == 0) {\n                cnt++; if (i * i != n) cnt++;\n            }\n        }\n        cout << cnt << endl;\n    }\n    return 0;\n}`
      }
    ]
  },
  {
    id: "c2_co_so",
    title: "Số học: Chuyển đổi hệ cơ số thập phân - nhị phân",
    level: "cap2",
    variations: [
      {
        subTitle: "Nhị phân hóa",
        description: "Chuyển số ~N~ ở hệ thập phân sang dạng nhị phân.",
        inputDesc: "Số nguyên dương ~N~.",
        outputDesc: "Chuỗi nhị phân.",
        subtasks: [{ id: 1, percent: 100, limit: "N \\le 10^{18}", desc: "chia dư cho 2.", minVal: 1, maxVal: 1000000000000000000 }],
        sampleTests: [{ input: "13", output: "1101" }],
        generateInput: function(subtaskId) {
          const sub = this.subtasks.find(s => s.id === subtaskId);
          const min = BigInt(sub.minVal);
          const max = BigInt(sub.maxVal);
          return (min + (BigInt(Math.floor(Math.random() * 1000000000)) % (max - min))).toString();
        },
        solve: function(inputStr) {
          let N = BigInt(inputStr.trim());
          if (N === 0n) return "0";
          let res = "";
          while (N > 0n) { res = (N % 2n).toString() + res; N /= 2n; }
          return res;
        },
        solutionCodePython: `import sys\nline = sys.stdin.read().strip()\nif line: print(bin(int(line))[2:])`,
        solutionCodeCpp: `#include <iostream>\n#include <string>\n#include <algorithm>\nusing namespace std;\nint main() {\n    long long n; if (cin >> n) {\n        if (n == 0) { cout << 0 << endl; return 0; }\n        string res = "";\n        while (n > 0) { res += to_string(n % 2); n /= 2; }\n        reverse(res.begin(), res.end());\n        cout << res << endl;\n    }\n    return 0;\n}`
      }
    ]
  },
  {
    id: "c2_chuoi_doi_xung",
    title: "Xâu ký tự: Xâu đối xứng dài nhất",
    level: "cap2",
    variations: [
      {
        subTitle: "Độ dài xâu con đối xứng",
        description: "Hãy tìm độ dài của xâu con liên tiếp đối xứng dài nhất trong xâu ~S~.",
        inputDesc: "Một dòng chứa xâu ~S~.",
        outputDesc: "Độ dài xâu con đối xứng.",
        subtasks: [
          { id: 1, percent: 40, limit: "Độ dài \\le 100", desc: "thuật toán O(N^3).", minVal: 10, maxVal: 100 },
          { id: 2, percent: 60, limit: "Độ dài \\le 5000", desc: "tối ưu O(N^2).", minVal: 101, maxVal: 4000 }
        ],
        sampleTests: [{ input: "abacaba", output: "7" }],
        generateInput: function(subtaskId) {
          const sub = this.subtasks.find(s => s.id === subtaskId);
          const len = Math.floor(Math.random() * (sub.maxVal - sub.minVal + 1)) + sub.minVal;
          const chars = "abcdefghijklmnopqrstuvwxyz";
          let res = "";
          if (Math.random() < 0.6) {
            let base = ""; for (let i = 0; i < len / 3; i++) base += chars[Math.floor(Math.random() * chars.length)];
            let palin = base + base.split("").reverse().join("");
            while (palin.length < len) palin += chars[Math.floor(Math.random() * chars.length)];
            return palin.substring(0, len);
          } else {
            for (let i = 0; i < len; i++) res += chars[Math.floor(Math.random() * chars.length)];
            return res;
          }
        },
        solve: function(inputStr) {
          const s = inputStr.trim();
          if (s.length === 0) return "0";
          let maxLen = 1;
          function expand(left, right) {
            while (left >= 0 && right < s.length && s[left] === s[right]) { left--; right++; }
            return right - left - 1;
          }
          for (let i = 0; i < s.length; i++) {
            let len = Math.max(expand(i, i), expand(i, i + 1));
            if (len > maxLen) maxLen = len;
          }
          return maxLen.toString();
        },
        solutionCodePython: `def solve(s):\n    if not s: return 0\n    def exp(l, r):\n        while l >= 0 and r < len(s) and s[l] == s[r]: l -= 1; r += 1\n        return r - l - 1\n    return max(max(exp(i, i), exp(i, i+1)) for i in range(len(s)))\nimport sys\nfor line in sys.stdin:\n    if line.strip(): print(solve(line.strip()))`,
        solutionCodeCpp: `#include <iostream>\n#include <string>\n#include <algorithm>\nusing namespace std;\nint exp(const string& s, int l, int r) {\n    while (l >= 0 && r < s.length() && s[l] == s[r]) { l--; r++; }\n    return r - l - 1;\n}\nint main() {\n    string s; if (cin >> s) {\n        int mx = 1;\n        for (int i=0; i<s.length(); i++) mx = max({mx, exp(s, i, i), exp(s, i, i+1)});\n        cout << mx << endl;\n    }\n    return 0;\n}`
      }
    ]
  },
  {
    id: "c2_chuan_hoa_chuoi",
    title: "Xâu ký tự: Chuẩn hóa xâu họ tên",
    level: "cap2",
    variations: [
      {
        subTitle: "Họ tên chuẩn",
        description: "Chuẩn hóa họ tên (xóa khoảng trắng thừa, viết hoa đầu từ).",
        inputDesc: "Xâu ~S~.",
        outputDesc: "Xâu họ tên đã chuẩn hóa.",
        subtasks: [{ id: 1, percent: 100, limit: "S \\le 1000", desc: "xử lý chuỗi.", minVal: 5, maxVal: 1000 }],
        sampleTests: [{ input: "   nguYen   vAn   tEo  ", output: "Nguyen Van Teo" }],
        generateInput: function(subtaskId) {
          const firstNames = ["nguyen", "tran", "le", "pham"];
          const lastNames = ["teo", "ti", "linh", "hoa"];
          return `   ${firstNames[Math.floor(Math.random() * 4)]}   ${lastNames[Math.floor(Math.random() * 4)]}  `;
        },
        solve: function(inputStr) {
          return inputStr.trim().split(/\s+/).map(w => w[0].toUpperCase() + w.substring(1).toLowerCase()).join(" ");
        },
        solutionCodePython: `import sys\nprint(" ".join(w.capitalize() for w in sys.stdin.read().split()))`,
        solutionCodeCpp: `#include <iostream>\n#include <string>\n#include <sstream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main() {\n    string s; if (getline(cin, s)) {\n        stringstream ss(s); string w; vector<string> res;\n        while (ss >> w) {\n            transform(w.begin(), w.end(), w.begin(), ::tolower); w[0] = toupper(w[0]);\n            res.push_back(w);\n        }\n        for(int i=0; i<res.size(); i++) cout << res[i] << (i == res.size()-1 ? "" : " ");\n        cout << endl;\n    }\n    return 0;\n}`
      }
    ]
  },
  {
    id: "c2_nen_chuoi",
    title: "Xâu ký tự: Mã hóa nén chuỗi ký tự (RLE)",
    level: "cap2",
    variations: [
      {
        subTitle: "Nén chuỗi",
        description: "Mã hóa nén chuỗi ký tự in hoa bằng RLE (ví dụ: ~AAABBCCCC~ nén thành ~A3B2C4~).",
        inputDesc: "Một dòng chứa xâu ~S~.",
        outputDesc: "Xâu đã nén.",
        subtasks: [{ id: 1, percent: 100, limit: "S \\le 10^5", desc: "thuật toán O(N).", minVal: 10, maxVal: 50000 }],
        sampleTests: [{ input: "AAABBCCCC", output: "A3B2C4" }],
        generateInput: function(subtaskId) {
          const chars = "ABCDEFGHIJ";
          let res = "";
          while (res.length < 50) res += chars[Math.floor(Math.random() * chars.length)].repeat(Math.floor(Math.random() * 4) + 1);
          return res;
        },
        solve: function(inputStr) {
          const s = inputStr.trim();
          if (!s) return "";
          let res = "", count = 1;
          for (let i = 1; i <= s.length; i++) {
            if (i < s.length && s[i] === s[i-1]) count++;
            else { res += s[i-1] + count; count = 1; }
          }
          return res;
        },
        solutionCodePython: `import sys\ns = sys.stdin.read().strip()\nif s:\n    res = []\n    cnt = 1\n    for i in range(1, len(s)):\n        if s[i] == s[i-1]: cnt += 1\n        else: res.append(s[i-1] + str(cnt)); cnt = 1\n    res.append(s[-1] + str(cnt))\n    print("".join(res))`,
        solutionCodeCpp: `#include <iostream>\n#include <string>\nusing namespace std;\nint main() {\n    string s; if (cin >> s) {\n        string res = ""; int cnt = 1;\n        for (int i=1; i<=s.length(); i++) {\n            if (i < s.length() && s[i] == s[i-1]) cnt++;\n            else { res += s[i-1] + to_string(cnt); cnt = 1; }\n        }\n        cout << res << endl;\n    }\n    return 0;\n}`
      }
    ]
  },
  {
    id: "c2_caesar",
    title: "Xâu ký tự: Mật mã Caesar",
    level: "cap2",
    variations: [
      {
        subTitle: "Dịch chuyển Caesar",
        description: "Dịch chuyển mỗi ký tự trong xâu in hoa ~S~ đi ~K~ bước theo vòng tròn bảng chữ cái.",
        inputDesc: "Xâu ~S~ và khóa ~K~ cách nhau bởi khoảng trắng hoặc xuống dòng.",
        outputDesc: "Xâu sau dịch chuyển.",
        subtasks: [{ id: 1, percent: 100, limit: "S \\le 10^5, K \\le 10^9", desc: "dùng mod 26.", minVal: 1, maxVal: 50000 }],
        sampleTests: [{ input: "HELLO\n3", output: "KHOOR" }],
        generateInput: function(subtaskId) {
          const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
          let res = ""; for (let i = 0; i < 20; i++) res += chars[Math.floor(Math.random() * chars.length)];
          return `${res}\n${Math.floor(Math.random() * 100) + 1}`;
        },
        solve: function(inputStr) {
          const lines = inputStr.trim().split("\n");
          const s = lines[0].trim();
          const K = parseInt(lines[1].trim()) % 26;
          let res = "";
          for (let i = 0; i < s.length; i++) {
            let code = s.charCodeAt(i);
            res += String.fromCharCode(((code - 65 + K) % 26) + 65);
          }
          return res;
        },
        solutionCodePython: `import sys\nlines = sys.stdin.read().split()\nif len(lines) >= 2:\n    s = lines[0]; k = int(lines[1]) % 26\n    print("".join(chr((ord(c) - 65 + k) % 26 + 65) if c.isupper() else c for c in s))`,
        solutionCodeCpp: `#include <iostream>\n#include <string>\nusing namespace std;\nint main() {\n    string s; int k; if (cin >> s >> k) {\n        k %= 26;\n        for (char &c : s) c = (c - 'A' + k) % 26 + 'A';\n        cout << s << endl;\n    }\n    return 0;\n}`
      }
    ]
  },
  {
    id: "c2_lcs",
    title: "Xâu ký tự: Xâu con chung dài nhất (LCS)",
    level: "cap2",
    variations: [
      {
        subTitle: "LCS của 2 xâu",
        description: "Tìm độ dài của xâu con chung dài nhất của hai xâu ~A~ và ~B~.",
        inputDesc: "Dòng đầu chứa ~A~. Dòng sau chứa ~B~.",
        outputDesc: "Một số nguyên duy nhất.",
        subtasks: [
          { id: 1, percent: 50, limit: "Độ dài \\le 100", desc: "quy hoạch động cơ bản.", minVal: 10, maxVal: 100 },
          { id: 2, percent: 50, limit: "Độ dài \\le 2000", desc: "DP tối ưu O(N*M).", minVal: 101, maxVal: 1500 }
        ],
        sampleTests: [{ input: "abcde\nace", output: "3" }],
        generateInput: function(subtaskId) {
          const sub = this.subtasks.find(s => s.id === subtaskId);
          const chars = "abcdefg";
          const lenA = Math.floor(Math.random() * (sub.maxVal - sub.minVal)) + sub.minVal;
          const lenB = Math.floor(Math.random() * (sub.maxVal - sub.minVal)) + sub.minVal;
          let a = "", b = "";
          for (let i = 0; i < lenA; i++) a += chars[Math.floor(Math.random() * chars.length)];
          for (let i = 0; i < lenB; i++) b += chars[Math.floor(Math.random() * chars.length)];
          return `${a}\n${b}`;
        },
        solve: function(inputStr) {
          const lines = inputStr.trim().split("\n");
          const a = lines[0].trim(), b = lines[1].trim();
          const n = a.length, m = b.length;
          const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
          for (let i = 1; i <= n; i++) {
            for (let j = 1; j <= m; j++) {
              if (a[i-1] === b[j-1]) dp[i][j] = dp[i-1][j-1] + 1;
              else dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
            }
          }
          return dp[n][m].toString();
        },
        solutionCodePython: `import sys\ndef lcs(A, B):\n    n, m = len(A), len(B)\n    dp = [[0]*(m+1) for _ in range(n+1)]\n    for i in range(1, n+1):\n        for j in range(1, m+1):\n            if A[i-1] == B[j-1]: dp[i][j] = dp[i-1][j-1] + 1\n            else: dp[i][j] = max(dp[i-1][j], dp[i][j-1])\n    return dp[n][m]\nlines = sys.stdin.read().split()\nif len(lines) >= 2: print(lcs(lines[0], lines[1]))`,
        solutionCodeCpp: `#include <iostream>\n#include <string>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main() {\n    string a, b; if (cin >> a >> b) {\n        int n = a.length(), m = b.length();\n        vector<vector<int>> dp(n + 1, vector<int>(m + 1, 0));\n        for (int i = 1; i <= n; i++) {\n            for (int j = 1; j <= m; j++) {\n                if (a[i-1] == b[j-1]) dp[i][j] = dp[i-1][j-1] + 1;\n                else dp[i][j] = max(dp[i-1][j], dp[i][j-1]);\n            }\n        }\n        cout << dp[n][m] << endl;\n    }\n    return 0;\n}`
      }
    ]
  },
  {
    id: "c2_binary_search",
    title: "Thuật toán: Tìm kiếm nhị phân",
    level: "cap2",
    variations: [
      {
        subTitle: "Tìm phần tử trên mảng đã sắp xếp",
        description: "Cho mảng tăng dần ~A~ gồm ~N~ số nguyên và số cần tìm ~X~. Hãy tìm vị trí xuất hiện của ~X~ (1-indexed). Nếu không tìm thấy, in ra ~-1~.",
        inputDesc: "Dòng đầu chứa ~N~ và ~X~. Dòng thứ hai chứa ~N~ số nguyên tăng dần.",
        outputDesc: "Vị trí của ~X~ hoặc ~-1~.",
        subtasks: [{ id: 1, percent: 100, limit: "N \\le 10^5", desc: "Tìm kiếm nhị phân O(log N).", minVal: 5, maxVal: 50000 }],
        sampleTests: [{ input: "5 3\n1 2 3 4 5", output: "3" }],
        generateInput: function(subtaskId) {
          const N = Math.floor(Math.random() * 50) + 10;
          let start = Math.floor(Math.random() * 5);
          const arr = [];
          for (let i = 0; i < N; i++) { start += Math.floor(Math.random() * 3) + 1; arr.push(start); }
          const X = arr[Math.floor(Math.random() * N)];
          return `${N} ${X}\n${arr.join(" ")}`;
        },
        solve: function(inputStr) {
          const lines = inputStr.trim().split("\n");
          const X = lines[0].trim().split(/\s+/).map(Number)[1];
          const a = lines[1].trim().split(/\s+/).map(Number);
          let l = 0, r = a.length - 1;
          while (l <= r) {
            let mid = Math.floor((l+r)/2);
            if (a[mid] === X) return (mid + 1).toString();
            if (a[mid] < X) l = mid + 1; else r = mid - 1;
          }
          return "-1";
        },
        solutionCodePython: `import sys\nlines = sys.stdin.read().split()\nif len(lines) > 2:\n    N = int(lines[0]); X = int(lines[1])\n    arr = list(map(int, lines[2:N+2]))\n    import bisect\n    idx = bisect.bisect_left(arr, X)\n    if idx < len(arr) and arr[idx] == X: print(idx + 1)\n    else: print("-1")`,
        solutionCodeCpp: `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main() {\n    int n; long long x;\n    if (cin >> n >> x) {\n        vector<long long> a(n); for (int i=0; i<n; i++) cin >> a[i];\n        auto it = lower_bound(a.begin(), a.end(), x);\n        if (it != a.end() && *it == x) cout << (it - a.begin() + 1) << endl;\n        else cout << -1 << endl;\n    }\n    return 0;\n}`
      }
    ]
  },
  {
    id: "c2_two_sum",
    title: "Thuật toán: Hai con trỏ",
    level: "cap2",
    variations: [
      {
        subTitle: "Cặp số có tổng bằng S",
        description: "Cho mảng tăng dần ~A~ gồm ~N~ số nguyên và một số ~S~. Hãy kiểm tra xem có tồn tại ~A_i + A_j = S~ (~i \\ne j~) hay không.",
        inputDesc: "N và S. Dòng hai chứa N số nguyên.",
        outputDesc: "YES hoặc NO.",
        subtasks: [
          { id: 1, percent: 40, limit: "N \\le 1000", desc: "duyệt hai vòng lặp lồng.", minVal: 5, maxVal: 1000 },
          { id: 2, percent: 60, limit: "N \\le 10^5", desc: "sử dụng hai con trỏ tối ưu O(N).", minVal: 1001, maxVal: 40000 }
        ],
        sampleTests: [{ input: "5 9\n1 2 4 5 7", output: "YES" }],
        generateInput: function(subtaskId) {
          const sub = this.subtasks.find(s => s.id === subtaskId);
          const N = Math.floor(Math.random() * (sub.maxVal - sub.minVal)) + sub.minVal;
          let start = 1; const arr = [];
          for (let i = 0; i < N; i++) { start += Math.floor(Math.random() * 3) + 1; arr.push(start); }
          const S = arr[Math.floor(Math.random() * (N/2))] + arr[Math.floor(Math.random() * (N/2)) + N/2];
          return `${N} ${S}\n${arr.join(" ")}`;
        },
        solve: function(inputStr) {
          const lines = inputStr.trim().split("\n");
          const S = lines[0].trim().split(/\s+/).map(Number)[1];
          const a = lines[1].trim().split(/\s+/).map(Number);
          let l = 0, r = a.length - 1;
          while (l < r) {
            let sum = a[l] + a[r];
            if (sum === S) return "YES";
            if (sum < S) l++; else r--;
          }
          return "NO";
        },
        solutionCodePython: `import sys\nlines = sys.stdin.read().split()\nif len(lines) > 2:\n    N = int(lines[0]); S = int(lines[1])\n    a = list(map(int, lines[2:N+2]))\n    l, r = 0, len(a) - 1\n    found = False\n    while l < r:\n        s = a[l] + a[r]\n        if s == S: found = True; break\n        elif s < S: l += 1\n        else: r -= 1\n    print("YES" if found else "NO")`,
        solutionCodeCpp: `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n; long long S; if (cin >> n >> S) {\n        vector<long long> a(n); for(int i=0; i<n; ++i) cin >> a[i];\n        int l = 0, r = n - 1; bool ok = false;\n        while (l < r) {\n            long long sum = a[l] + a[r];\n            if (sum == S) { ok = true; break; }\n            if (sum < S) l++; else r--;\n        }\n        cout << (ok ? "YES" : "NO") << endl;\n    }\n    return 0;\n}`
      }
    ]
  },
  {
    id: "c2_sort",
    title: "Thuật toán: Sắp xếp mảng",
    level: "cap2",
    variations: [
      {
        subTitle: "Sắp xếp tăng dần",
        description: "Sắp xếp ~N~ phần tử trong mảng số nguyên theo thứ tự tăng dần.",
        inputDesc: "N và mảng N phần tử.",
        outputDesc: "Mảng tăng dần.",
        subtasks: [{ id: 1, percent: 100, limit: "N \\le 10^5", desc: "O(N log N).", minVal: 5, maxVal: 50000 }],
        sampleTests: [{ input: "5\n4 2 5 1 3", output: "1 2 3 4 5" }],
        generateInput: function(subtaskId) {
          const N = Math.floor(Math.random() * 40) + 10;
          const arr = Array.from({ length: N }, () => Math.floor(Math.random() * 1000) - 500);
          return `${N}\n${arr.join(" ")}`;
        },
        solve: function(inputStr) {
          const lines = inputStr.trim().split("\n");
          const a = lines[1].trim().split(/\s+/).map(Number);
          a.sort((x, y) => x - y); return a.join(" ");
        },
        solutionCodePython: `import sys\nlines = sys.stdin.read().split()\nif len(lines) > 1: print(" ".join(map(str, sorted(map(int, lines[1:])))))`,
        solutionCodeCpp: `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main() {\n    int n; if (cin >> n) {\n        vector<long long> a(n); for(int i=0; i<n; i++) cin >> a[i];\n        sort(a.begin(), a.end());\n        for(int i=0; i<n; i++) cout << a[i] << (i==n-1 ? "" : " "); cout << endl;\n    }\n    return 0;\n}`
      }
    ]
  },
  {
    id: "c2_kth_largest",
    title: "Mảng: Tìm phần tử lớn thứ K",
    level: "cap2",
    variations: [
      {
        subTitle: "Lớn thứ K",
        description: "Tìm phần tử có giá trị lớn thứ ~K~ của mảng.",
        inputDesc: "N và K. Dòng hai là N phần tử.",
        outputDesc: "Một số nguyên duy nhất.",
        subtasks: [{ id: 1, percent: 100, limit: "K \\le N \\le 10^5", desc: "sắp xếp mảng.", minVal: 5, maxVal: 50000 }],
        sampleTests: [{ input: "5 2\n3 1 5 4 2", output: "4" }],
        generateInput: function(subtaskId) {
          const N = Math.floor(Math.random() * 40) + 10;
          const K = Math.floor(Math.random() * (N / 2)) + 1;
          const arr = Array.from({ length: N }, () => Math.floor(Math.random() * 2000) - 1000);
          return `${N} ${K}\n${arr.join(" ")}`;
        },
        solve: function(inputStr) {
          const lines = inputStr.trim().split("\n");
          const K = parseInt(lines[0].trim().split(/\s+/)[1]);
          const a = lines[1].trim().split(/\s+/).map(Number);
          a.sort((x, y) => y - x); return a[K - 1].toString();
        },
        solutionCodePython: `import sys\nlines = sys.stdin.read().split()\nif len(lines) > 2:\n    N = int(lines[0]); K = int(lines[1])\n    arr = sorted(map(int, lines[2:N+2]), reverse=True)\n    print(arr[K-1])`,
        solutionCodeCpp: `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main() {\n    int n, k; if (cin >> n >> k) {\n        vector<long long> a(n); for(int i=0; i<n; i++) cin >> a[i];\n        sort(a.rbegin(), a.rend()); cout << a[k-1] << endl;\n    }\n    return 0;\n}`
      }
    ]
  },
  {
    id: "c2_tong_doan_con",
    title: "Mảng: Tổng đoạn con liên tiếp lớn nhất",
    level: "cap2",
    variations: [
      {
        subTitle: "Tổng cực đại",
        description: "Tìm tổng lớn nhất của một đoạn con liên tiếp của mảng ~A~.",
        inputDesc: "N và mảng N số.",
        outputDesc: "Một số nguyên duy nhất.",
        subtasks: [
          { id: 1, percent: 40, limit: "N \\le 1000", desc: "O(N^2).", minVal: 5, maxVal: 1000 },
          { id: 2, percent: 60, limit: "N \\le 10^5", desc: "Kadane O(N).", minVal: 1001, maxVal: 40000 }
        ],
        sampleTests: [{ input: "5\n2 -3 4 -1 2", output: "5" }],
        generateInput: function(subtaskId) {
          const sub = this.subtasks.find(s => s.id === subtaskId);
          const N = Math.floor(Math.random() * (sub.maxVal - sub.minVal)) + sub.minVal;
          const arr = Array.from({ length: N }, () => Math.floor(Math.random() * 200) - 100);
          return `${N}\n${arr.join(" ")}`;
        },
        solve: function(inputStr) {
          const lines = inputStr.trim().split("\n");
          const a = lines[1].trim().split(/\s+/).map(Number);
          let mx = a[0], curr = a[0];
          for (let i = 1; i < a.length; i++) { curr = Math.max(a[i], curr + a[i]); mx = Math.max(mx, curr); }
          return mx.toString();
        },
        solutionCodePython: `import sys\nlines = sys.stdin.read().split()\nif len(lines) > 1:\n    arr = list(map(int, lines[1:]))\n    mx = curr = arr[0]\n    for x in arr[1:]: curr = max(x, curr + x); mx = max(mx, curr)\n    print(mx)`,
        solutionCodeCpp: `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main() {\n    int n; if (cin >> n) {\n        vector<long long> a(n); for(int i=0; i<n; i++) cin >> a[i];\n        long long mx = a[0], curr = a[0];\n        for (int i = 1; i < n; i++) { curr = max(a[i], curr + a[i]); mx = max(mx, curr); }\n        cout << mx << endl;\n    }\n    return 0;\n}`
      }
    ]
  },
  {
    id: "c2_lis",
    title: "Mảng: Dãy con tăng dài nhất (LIS)",
    level: "cap2",
    variations: [
      {
        subTitle: "Độ dài LIS",
        description: "Tìm độ dài của dãy con tăng dài nhất trong mảng ~A~.",
        inputDesc: "N và mảng.",
        outputDesc: "Một số nguyên duy nhất.",
        subtasks: [
          { id: 1, percent: 50, limit: "N \\le 1000", desc: "Quy hoạch động O(N^2).", minVal: 5, maxVal: 1000 },
          { id: 2, percent: 50, limit: "N \\le 10^5", desc: "DP + Binary Search O(N log N).", minVal: 1001, maxVal: 20000 }
        ],
        sampleTests: [{ input: "6\n1 2 0 4 3 5", output: "4" }],
        generateInput: function(subtaskId) {
          const sub = this.subtasks.find(s => s.id === subtaskId);
          const N = Math.floor(Math.random() * (sub.maxVal - sub.minVal)) + sub.minVal;
          const arr = Array.from({ length: N }, () => Math.floor(Math.random() * 1000) + 1);
          return `${N}\n${arr.join(" ")}`;
        },
        solve: function(inputStr) {
          const lines = inputStr.trim().split("\n");
          const a = lines[1].trim().split(/\s+/).map(Number);
          const tails = [];
          for (let x of a) {
            let l = 0, r = tails.length;
            while (l < r) {
              let m = Math.floor((l+r)/2);
              if (tails[m] < x) l = m + 1; else r = m;
            }
            if (l === tails.length) tails.push(x); else tails[l] = x;
          }
          return tails.length.toString();
        },
        solutionCodePython: `import sys, bisect\nlines = sys.stdin.read().split()\nif len(lines) > 1:\n    arr = list(map(int, lines[1:]))\n    tails = []\n    for x in arr:\n        idx = bisect.bisect_left(tails, x)\n        if idx == len(tails): tails.append(x)\n        else: tails[idx] = x\n    print(len(tails))`,
        solutionCodeCpp: `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main() {\n    int n; if (cin >> n) {\n        vector<int> a(n); for(int i=0; i<n; ++i) cin >> a[i];\n        vector<int> tails;\n        for (int x : a) {\n            auto it = lower_bound(tails.begin(), tails.end(), x);\n            if (it == tails.end()) tails.push_back(x); else *it = x;\n        }\n        cout << tails.size() << endl;\n    }\n    return 0;\n}`
      }
    ]
  },
  {
    id: "c2_knapsack",
    title: "Quy hoạch động: Cái túi Knapsack",
    level: "cap2",
    variations: [
      {
        subTitle: "Balo Knapsack 0-1",
        description: "Có ~N~ món đồ, món đồ ~i~ nặng ~w_i~ có giá trị ~v_i~. Hãy tìm cách chọn các món đồ bỏ vào túi tải trọng tối đa ~W~ sao cho tổng giá trị lớn nhất.",
        inputDesc: "N và W. N dòng sau mỗi dòng chứa w_i và v_i.",
        outputDesc: "Một số nguyên duy nhất.",
        subtasks: [
          { id: 1, percent: 50, limit: "N, W \\le 100", desc: "quy hoạch động cơ bản.", minVal: 5, maxVal: 100 },
          { id: 2, percent: 50, limit: "N \\le 100, W \\le 10^5", desc: "DP tối ưu bộ nhớ.", minVal: 10, maxVal: 500 }
        ],
        sampleTests: [{ input: "3 4\n1 15\n2 20\n3 30", output: "45" }],
        generateInput: function(subtaskId) {
          const N = Math.floor(Math.random() * 8) + 4;
          const W = subtaskId === 1 ? 50 : 2000;
          let res = `${N} ${W}`;
          for (let i = 0; i < N; i++) res += `\n${Math.floor(Math.random() * (W / 3)) + 1} ${Math.floor(Math.random() * 100) + 10}`;
          return res;
        },
        solve: function(inputStr) {
          const lines = inputStr.trim().split("\n");
          const parts = lines[0].trim().split(/\s+/).map(Number);
          const N = parts[0], W = parts[1];
          const dp = new Array(W + 1).fill(0);
          for (let i = 1; i <= N; i++) {
            const itemParts = lines[i].trim().split(/\s+/).map(Number);
            const w = itemParts[0], v = itemParts[1];
            for (let j = W; j >= w; j--) dp[j] = Math.max(dp[j], dp[j - w] + v);
          }
          return dp[W].toString();
        },
        solutionCodePython: `import sys\nlines = sys.stdin.read().split()\nif len(lines) > 2:\n    N, W = int(lines[0]), int(lines[1])\n    dp = [0] * (W + 1)\n    idx = 2\n    for _ in range(N):\n        w = int(lines[idx]); v = int(lines[idx+1]); idx += 2\n        for j in range(W, w - 1, -1): dp[j] = max(dp[j], dp[j - w] + v)\n    print(dp[W])`,
        solutionCodeCpp: `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main() {\n    int n, w_max; if (cin >> n >> w_max) {\n        vector<long long> dp(w_max + 1, 0);\n        for (int i=0; i<n; ++i) {\n            long long w, v; cin >> w >> v;\n            for (int j = w_max; j >= w; --j) dp[j] = max(dp[j], dp[j - w] + v);\n        }\n        cout << dp[w_max] << endl;\n    }\n    return 0;\n}`
      }
    ]
  },
  {
    id: "c2_doi_tien",
    title: "Quy hoạch động: Đổi tiền xu",
    level: "cap2",
    variations: [
      {
        subTitle: "Mệnh giá đổi tối thiểu",
        description: "Tìm số xu ít nhất để đổi số tiền ~S~ từ ~N~ mệnh giá đồng xu.",
        inputDesc: "N và S. Dòng hai chứa N mệnh giá.",
        outputDesc: "Số xu ít nhất hoặc -1.",
        subtasks: [
          { id: 1, percent: 50, limit: "S \\le 1000", desc: "DP.", minVal: 10, maxVal: 1000 },
          { id: 2, percent: 50, limit: "S \\le 10^5", desc: "DP tối ưu.", minVal: 1001, maxVal: 50000 }
        ],
        sampleTests: [{ input: "3 11\n1 2 5", output: "3" }],
        generateInput: function(subtaskId) {
          const sub = this.subtasks.find(s => s.id === subtaskId);
          const N = Math.floor(Math.random() * 5) + 3;
          const S = Math.floor(Math.random() * (sub.maxVal - sub.minVal)) + sub.minVal;
          const coins = [1];
          for (let i = 1; i < N; i++) coins.push(coins[i-1] + Math.floor(Math.random() * 4) + 1);
          return `${N} ${S}\n${coins.join(" ")}`;
        },
        solve: function(inputStr) {
          const lines = inputStr.trim().split("\n");
          const S = parseInt(lines[0].trim().split(/\s+/)[1]);
          const coins = lines[1].trim().split(/\s+/).map(Number);
          const dp = new Array(S + 1).fill(Infinity); dp[0] = 0;
          for (let coin of coins) {
            for (let j = coin; j <= S; j++) if (dp[j - coin] !== Infinity) dp[j] = Math.min(dp[j], dp[j - coin] + 1);
          }
          return dp[S] === Infinity ? "-1" : dp[S].toString();
        },
        solutionCodePython: `import sys\nlines = sys.stdin.read().split()\nif len(lines) > 2:\n    N = int(lines[0]); S = int(lines[1])\n    coins = list(map(int, lines[2:N+2]))\n    dp = [float('inf')] * (S + 1); dp[0] = 0\n    for c in coins:\n        for j in range(c, S + 1): dp[j] = min(dp[j], dp[j - c] + 1)\n    print(dp[S] if dp[S] != float('inf') else -1)`,
        solutionCodeCpp: `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nconst int INF = 1e9;\nint main() {\n    int n, s; if (cin >> n >> s) {\n        vector<int> coins(n); for(int i=0; i<n; i++) cin >> coins[i];\n        vector<int> dp(s + 1, INF); dp[0] = 0;\n        for (int c : coins) for (int j = c; j <= s; ++j) dp[j] = min(dp[j], dp[j - c] + 1);\n        cout << (dp[s] >= INF ? -1 : dp[s]) << endl;\n    }\n    return 0;\n}`
      }
    ]
  },
  {
    id: "c2_grid_dp",
    title: "Quy hoạch động: Đường đi trên lưới",
    level: "cap2",
    variations: [
      {
        subTitle: "Chi phí tối thiểu trên bảng ô vuông",
        description: "Tìm tổng chi phí nhỏ nhất để đi từ ~(1, 1)~ đến ~(M, N)~ bằng cách đi sang phải hoặc xuống dưới.",
        inputDesc: "M và N. M dòng sau mỗi dòng là N số chi phí ô.",
        outputDesc: "Một số nguyên duy nhất.",
        subtasks: [{ id: 1, percent: 100, limit: "M, N \\le 300", desc: "quy hoạch động lưới ô vuông.", minVal: 2, maxVal: 300 }],
        sampleTests: [{ input: "3 3\n1 3 1\n1 5 1\n4 2 1", output: "7" }],
        generateInput: function(subtaskId) {
          const M = Math.floor(Math.random() * 5) + 3;
          const N = Math.floor(Math.random() * 5) + 3;
          let res = `${M} ${N}`;
          for (let i = 0; i < M; i++) {
            const row = Array.from({ length: N }, () => Math.floor(Math.random() * 10) + 1);
            res += `\n${row.join(" ")}`;
          }
          return res;
        },
        solve: function(inputStr) {
          const lines = inputStr.trim().split("\n");
          const parts = lines[0].trim().split(/\s+/).map(Number);
          const M = parts[0], N = parts[1];
          const grid = [];
          for (let i = 1; i <= M; i++) grid.push(lines[i].trim().split(/\s+/).map(Number));
          const dp = Array.from({ length: M }, () => new Array(N).fill(0));
          dp[0][0] = grid[0][0];
          for (let j = 1; j < N; j++) dp[0][j] = dp[0][j-1] + grid[0][j];
          for (let i = 1; i < M; i++) dp[i][0] = dp[i-1][0] + grid[i][0];
          for (let i = 1; i < M; i++) {
            for (let j = 1; j < N; j++) dp[i][j] = Math.min(dp[i-1][j], dp[i][j-1]) + grid[i][j];
          }
          return dp[M-1][N-1].toString();
        },
        solutionCodePython: `import sys\nlines = sys.stdin.read().split()\nif len(lines) > 2:\n    M, N = int(lines[0]), int(lines[1])\n    grid = []\n    idx = 2\n    for _ in range(M): grid.append(list(map(int, lines[idx:idx+N]))); idx += N\n    dp = [[0]*N for _ in range(M)]\n    dp[0][0] = grid[0][0]\n    for j in range(1, N): dp[0][j] = dp[0][j-1] + grid[0][j]\n    for i in range(1, M): dp[i][0] = dp[i-1][0] + grid[i][0]\n    for i in range(1, M):\n        for j in range(1, N): dp[i][j] = min(dp[i-1][j], dp[i][j-1]) + grid[i][j]\n    print(dp[M-1][N-1])`,
        solutionCodeCpp: `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main() {\n    int m, n; if (cin >> m >> n) {\n        vector<vector<long long>> grid(m, vector<long long>(n));\n        for(int i=0; i<m; ++i) for(int j=0; j<n; ++j) cin >> grid[i][j];\n        vector<vector<long long>> dp(m, vector<long long>(n, 0));\n        dp[0][0] = grid[0][0];\n        for(int j=1; j<n; ++j) dp[0][j] = dp[0][j-1] + grid[0][j];\n        for(int i=1; i<m; ++i) dp[i][0] = dp[i-1][0] + grid[i][0];\n        for(int i=1; i<m; ++i) for(int j=1; j<n; ++j) dp[i][j] = min(dp[i-1][j], dp[i][j-1]) + grid[i][j];\n        cout << dp[m-1][n-1] << endl;\n    }\n    return 0;\n}`
      }
    ]
  }
];

// Export to window
window.examTemplates = contestGenerators;
