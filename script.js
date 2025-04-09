// script.js
// Danh sách 100 từ tiếng Anh
const words = [
    "apple", "ball", "cat", "dog", "elephant", "fish", "giraffe", "horse", "ice", "jacket",
    "kite", "lion", "monkey", "nest", "owl", "panda", "queen", "rabbit", "snake", "tiger",
    "umbrella", "violin", "whale", "xylophone", "yogurt", "zebra", "bear", "cake", "duck", "egg",
    "flower", "goat", "hat", "ink", "juice", "kangaroo", "lemon", "mouse", "noodle", "orange",
    "pig", "quilt", "rose", "sun", "tree", "unicorn", "vase", "wolf", "xray", "yacht",
    "ant", "bird", "cow", "deer", "eagle", "fox", "grape", "hen", "igloo", "jam",
    "key", "lamp", "moon", "net", "ocean", "pen", "quiz", "ring", "star", "train",
    "up", "van", "wind", "box", "yarn", "zip", "bell", "cake", "door", "ear",
    "fan", "gift", "hill", "jet", "king", "leaf", "milk", "nose", "park", "queen",
    "rock", "sand", "toy", "vine", "wave", "yard", "zoo", "bus", "car", "desk"
];

// Danh sách nghĩa tiếng Việt tương ứng
const meanings = [
    "táo", "quả bóng", "mèo", "chó", "voi", "cá", "hươu cao cổ", "ngựa", "đá", "áo khoác",
    "diều", "sư tử", "khỉ", "tổ", "cú", "gấu trúc", "nữ hoàng", "thỏ", "rắn", "hổ",
    "ô", "đàn violin", "cá voi", "đàn xylophone", "sữa chua", "ngựa vằn", "gấu", "bánh", "vịt", "trứng",
    "hoa", "dê", "mũ", "mực", "nước ép", "chuột túi", "chanh", "chuột", "mì", "cam",
    "lợn", "chăn", "hoa hồng", "mặt trời", "cây", "kỳ lân", "bình hoa", "sói", "tia X", "du thuyền",
    "kiến", "chim", "bò", "nai", "đại bàng", "cáo", "nho", "gà mái", "nhà tuyết", "mứt",
    "chìa khóa", "đèn", "mặt trăng", "lưới", "đại dương", "bút", "câu đố", "nhẫn", "ngôi sao", "tàu hỏa",
    "lên", "xe tải", "gió", "hộp", "sợi", "khóa kéo", "chuông", "bánh", "cửa", "tai",
    "quạt", "quà", "đồi", "máy bay", "vua", "lá", "sữa", "mũi", "công viên", "nữ hoàng",
    "đá", "cát", "đồ chơi", "dây leo", "sóng", "sân", "sở thú", "xe buýt", "xe hơi", "bàn"
];

// Lấy các phần tử HTML và kiểm tra lỗi
const wordDisplay = document.getElementById("current-word");
const wordInput = document.getElementById("word-input");
const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");
const restartBtn = document.getElementById("restart-btn");
const meaningDisplay = document.getElementById("word-meaning");
const speakBtn = document.getElementById("speak-btn");

// Tạo thẻ audio ẩn để phát âm thanh
const audioPlayer = document.createElement("audio");
document.body.appendChild(audioPlayer);

// Kiểm tra xem các phần tử có tồn tại không
if (!wordDisplay || !wordInput || !scoreDisplay || !timeDisplay || !restartBtn || !meaningDisplay || !speakBtn) {
    console.error("Một hoặc nhiều phần tử HTML không được tìm thấy. Kiểm tra file index.html.");
}

// Khởi tạo biến
let currentWord = "";
let currentMeaning = "";
let score = 0;
let time = 180; // Thay đổi từ 60 thành 180 giây
let timer;

// Hàm phát âm tiếng Anh bằng Web Speech API
function speakEnglish(word) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(word);
        utterance.lang = "en-US";
        utterance.rate = 0.8;
        speechSynthesis.speak(utterance);
        return utterance;
    } else {
        console.warn("Trình duyệt không hỗ trợ Web Speech API.");
        return null;
    }
}

// Hàm phát âm tiếng Việt bằng Google Translate TTS
function speakVietnamese(meaning) {
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(meaning)}&tl=vi&client=tw-ob`;
    audioPlayer.src = url;
    audioPlayer.play();
}

// Hàm chọn từ ngẫu nhiên và phát âm cả tiếng Anh lẫn tiếng Việt
function getRandomWord() {
    const index = Math.floor(Math.random() * words.length);
    const word = words[index];
    const meaning = meanings[index];
    
    // Phát âm tiếng Anh
    const englishUtterance = speakEnglish(word);
    
    // Khi tiếng Anh xong, phát tiếng Việt
    if (englishUtterance) {
        englishUtterance.onend = () => {
            speakVietnamese(meaning);
        };
    } else {
        speakVietnamese(meaning); // Nếu không có tiếng Anh, phát luôn tiếng Việt
    }
    
    return { word, meaning };
}

// Hàm bắt đầu trò chơi
function startGame() {
    score = 0;
    time = 180; // Thay đổi từ 60 thành 180 giây
    if (scoreDisplay) scoreDisplay.textContent = score;
    if (timeDisplay) timeDisplay.textContent = time;
    if (wordInput) {
        wordInput.value = "";
        wordInput.disabled = false;
        wordInput.focus();
    }
    const { word, meaning } = getRandomWord();
    currentWord = word;
    currentMeaning = meaning;
    if (wordDisplay) wordDisplay.textContent = currentWord;
    if (meaningDisplay) meaningDisplay.textContent = meaning;

    // Đếm ngược thời gian
    clearInterval(timer);
    timer = setInterval(() => {
        time--;
        if (timeDisplay) timeDisplay.textContent = time;
        if (time <= 0) {
            clearInterval(timer);
            if (wordInput) wordInput.disabled = true;
            alert(`Hết thời gian! Điểm của bạn: ${score}`);
        }
    }, 1000);
}

// Kiểm tra từ gõ
if (wordInput) {
    wordInput.addEventListener("input", () => {
        if (wordInput.value === currentWord) {
            score++;
            if (scoreDisplay) scoreDisplay.textContent = score;
            wordInput.value = "";
            const { word, meaning } = getRandomWord();
            currentWord = word;
            currentMeaning = meaning;
            if (wordDisplay) wordDisplay.textContent = currentWord;
            if (meaningDisplay) meaningDisplay.textContent = meaning;
        }
    });
}

// Nút phát âm lại
if (speakBtn) {
    speakBtn.addEventListener("click", () => {
        const englishUtterance = speakEnglish(currentWord);
        if (englishUtterance) {
            englishUtterance.onend = () => {
                speakVietnamese(currentMeaning);
            };
        } else {
            speakVietnamese(currentMeaning);
        }
    });
}

// Bắt đầu lại trò chơi
if (restartBtn) {
    restartBtn.addEventListener("click", startGame);
}

// Bắt đầu trò chơi lần đầu
startGame();