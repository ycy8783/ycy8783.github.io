let stats = { money: 100, stress: 50, stability: 50 };
const locations = ["home", "office", "news"];
let currentTurn = 0;
let isMuted = true; // 🔇 기본은 음소거

const backgroundMap = {
  home: "img/home.jpg",
  office: "img/office.jpg",
  news: "img/news.jpg"
};

const bgmIntro = new Audio("audio/1.mp3");
const bgmMain = new Audio("audio/2.mp3");
const bgmEnding = new Audio("audio/3.mp3");

[bgmIntro, bgmMain, bgmEnding].forEach(bgm => {
  bgm.loop = true;
  bgm.volume = 0.7;
});

function fadeOut(audio, callback) {
  const fadeInterval = setInterval(() => {
    if (audio.volume > 0.05) {
      audio.volume -= 0.05;
    } else {
      audio.pause();
      clearInterval(fadeInterval);
      if (callback) callback();
    }
  }, 100);
}

function fadeIn(audio) {
  audio.volume = 0;
  audio.play();
  const fadeInterval = setInterval(() => {
    if (audio.volume < 0.7) {
      audio.volume += 0.05;
    } else {
      clearInterval(fadeInterval);
    }
  }, 100);
}

// 🔊 사운드 토글 버튼
window.addEventListener("DOMContentLoaded", () => {
  const soundToggle = document.getElementById("soundToggle");
  soundToggle.onclick = () => {
    isMuted = !isMuted;

    if (isMuted) {
      [bgmIntro, bgmMain, bgmEnding].forEach(audio => audio.pause());
      soundToggle.innerText = "🔇";
    } else {
      if (currentTurn === 0) {
        fadeIn(bgmIntro);
      } else if (currentTurn < 9) {
        fadeIn(bgmMain);
      } else {
        fadeIn(bgmEnding);
      }
      soundToggle.innerText = "🔊";
    }
  };
});

const events = {
  home: [
    {
      title: "월세 인상 통보",
      text: "집주인이 다음 달부터 월세를 올린다고 한다.",
      choices: [
        { label: "참고 더 산다", money: -30, stress: +5, stability: -10 },
        { label: "이사를 고려한다", money: -50, stress: +15, stability: 0 }
      ]
    },
    {
      title: "비혼 선언한 친구의 고백",
      text: "“애 안 낳을 거야. 내 삶 지키는 게 먼저야.” 고개가 끄덕여졌다.",
      choices: [
        { label: "공감했다", money: 0, stress: -10, stability: 0 },
        { label: "난 아직 모르겠다", money: 0, stress: +5, stability: 0 }
      ]
    },
    {
      title: "전세 사기 피해자 인터뷰",
      text: "몇 천만 원을 날렸다며 울먹이는 인터뷰를 본다.",
      choices: [
        { label: "남 일 같지 않다", money: -10, stress: +20, stability: -10 },
        { label: "내 일만 잘 챙기자", money: 0, stress: 0, stability: 0 }
      ]
    }
  ],
  office: [
    {
      title: "야근 지시",
      text: "오늘도 예상치 못한 야근이 떨어졌다.",
      choices: [
        { label: "순응한다", money: +20, stress: +20, stability: -5 },
        { label: "불만을 표출한다", money: 0, stress: +10, stability: -10 }
      ]
    },
    {
      title: "출산하면 커리어 끝",
      text: "육아휴직 복귀 후 좌천됐다는 소문이 돌고 있다. 출산=경력단절, 이게 진짜일까?",
      choices: [
        { label: "그건 그 사람 문제야", money: +50, stress: 0, stability: 0 },
        { label: "나도 그럴까 봐 무섭다", money: 0, stress: +20, stability: -5 }
      ]
    },
    {
      title: "승진 누락 통보",
      text: "성과에도 불구하고 승진에서 제외되었다.",
      choices: [
        { label: "항의한다", money: 0, stress: +10, stability: -10 },
        { label: "받아들인다", money: 0, stress: +5, stability: -5 }
      ]
    }
  ],
  news: [
    {
      title: "출산율 뉴스",
      text: "출산율 최저치 갱신. 정부는 청년 탓을 한다.",
      choices: [
        { label: "무감각해진다", money: 0, stress: +10, stability: -5 },
        { label: "화가 난다", money: 0, stress: +15, stability: -10 }
      ]
    },
    {
      title: "가임기 여성 지도 발표 논란",
      text: "정부가 여성 인구를 지역별로 분류했다. 출산을 통계로만 보는 듯하다.",
      choices: [
        { label: "문제를 제기한다", money: 0, stress: -5, stability: +5 },
        { label: "별생각 없이 넘긴다", money: 0, stress: +10, stability: -5 }
      ]
    },
    {
      title: "결혼 장려금 논란",
      text: "정부가 '결혼하면 돈 준다'는 정책을 발표했지만, 정작 청년들은 생활비도 벅차다.",
      choices: [
        { label: "현실을 전혀 모르네", money: 0, stress: +10, stability: -5 },
        { label: "그냥 웃고 넘긴다", money: 0, stress: +5, stability: 0 }
      ]
    }
  ]
};


function updateStatsDisplay() {
  const moneyEl = document.getElementById("money");
  const stressEl = document.getElementById("stress");
  const stabilityEl = document.getElementById("stability");

  [moneyEl, stressEl, stabilityEl].forEach(el =>
    el.classList.remove("stat-green", "stat-orange", "stat-red")
  );

  if (stats.money >= 70) moneyEl.classList.add("stat-green");
  else if (stats.money >= 40) moneyEl.classList.add("stat-orange");
  else moneyEl.classList.add("stat-red");

  if (stats.stress <= 50) stressEl.classList.add("stat-green");
  else if (stats.stress <= 69) stressEl.classList.add("stat-orange");
  else stressEl.classList.add("stat-red");

  if (stats.stability >= 50) stabilityEl.classList.add("stat-green");
  else if (stats.stability >= 20) stabilityEl.classList.add("stat-orange");
  else stabilityEl.classList.add("stat-red");

  moneyEl.innerText = stats.money;
  stressEl.innerText = stats.stress;
  stabilityEl.innerText = stats.stability;
}

function getCurrentLocation() {
  return locations[currentTurn % locations.length];
}

function updateBackground(location, callback) {
  const bg = document.getElementById("background");
  bg.classList.remove("visible", "blurred");

  setTimeout(() => {
    bg.src = backgroundMap[location];

    if (currentTurn < 3) {
      bg.classList.add("visible");
      setTimeout(() => {
        bg.classList.add("blurred");
        callback();
      }, 500);
    } else {
      bg.classList.add("blurred");
      setTimeout(() => {
        bg.classList.add("visible");
        setTimeout(callback, 500);
      }, 50);
    }
  }, 100);
}

function showCardContent(location) {
  const eventSet = events[location];
  const event = eventSet[Math.floor(currentTurn / 3)];
  const card = document.getElementById("eventCard");
  const statsBox = document.getElementById("stats");

  document.getElementById("eventTitle").innerText = event.title;
  document.getElementById("eventText").innerText = event.text;

  const buttonContainer = document.getElementById("choiceButtons");
  buttonContainer.innerHTML = "";

  event.choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.className = "choice-button";
    btn.innerText = `${choice.label} (💰${choice.money} / 😵${choice.stress} / 🧱${choice.stability})`;

  btn.onclick = () => {
    stats.money += choice.money;
    stats.stress += choice.stress;
    stats.stability += choice.stability;

    updateStatsDisplay();

    if (stats.money <= 0 || stats.stress <= 0 || stats.stability <= 0) {
      showFinalMessage("출산 포기", "우리는 포기하지 않았다. \n단지, 선택지를 빼앗겼을 뿐이다.");
      return;
    }

    currentTurn++;

    if (currentTurn === 3) {
      showIntermediateMessage("봄이 지났습니다. 피로가 누적되며 불안감이 커집니다.", () => {
        showEvent();
      });
    } else if (currentTurn === 6) {
      showIntermediateMessage("여름을 지나 가을입니다. 이제는 버티는 것도 익숙해졌습니다.", () => {
        showEvent();
      });
    } else if (currentTurn === 9) {
      fadeOut(bgmMain, () => fadeIn(bgmEnding)); // 🔥 이 줄 추가
      showIntermediateMessage("겨울입니다. 이제 선택의 시간이 끝났습니다.", () => {
        const total = stats.money + stats.stress + stats.stability;
        if (total <= 200) {
          showFinalMessage("출산 유예", `출산은 인생의 다음 단계가 아닌, \n계속 미뤄지는 불확실한 변수였다.`);
        } else {
          showFinalMessage("출산 결심", `결심은 가능했다. \n하지만 이 구조에서, 누구나 같은 선택을 할 수 있을까?`);
        }
      });
    }
 else {
      showEvent();
    }
  };

    buttonContainer.appendChild(btn);
  });

  card.style.display = "block";
  setTimeout(() => card.classList.add("show"), 50);

  if (!statsBox.classList.contains("show")) {
    statsBox.style.display = "block";
    setTimeout(() => statsBox.classList.add("show"), 50);
  }
}

function showIntermediateMessage(message, callback) {
  const msgEl = document.getElementById("turnMessage");
  msgEl.innerText = message;
  msgEl.classList.add("show");
  msgEl.style.display = "block";

  setTimeout(() => {
    msgEl.classList.remove("show");
    msgEl.style.display = "none";
    callback();
  }, 3000);
}

function showEvent() {
  const location = getCurrentLocation();
  const card = document.getElementById("eventCard");

  card.classList.remove("show");
  card.style.display = "none";

  updateBackground(location, () => {
    showCardContent(location);
  });
}

function showFinalMessage(title, message) {
  const card = document.getElementById("eventCard");
  card.classList.remove("show");
  card.style.display = "none";
  showEndingCard(title, message);


  setTimeout(() => {
    msgEl.classList.remove("show");
    msgEl.style.display = "none";
    showEndingCard(title, message);
  }, 3000);
}

function showEndingCard(title, message) {
  const endingCard = document.getElementById("endingCard");
  const endingTitleEl = document.getElementById("endingTitle");
  const endingTextEl = document.getElementById("endingText");

  endingTitleEl.innerText = title;
  endingTextEl.innerHTML = ""; 
  endingCard.style.display = "block";
  setTimeout(() => endingCard.classList.add("show"), 50);
  document.getElementById("stats").style.display = "none";
  document.getElementById("eventCard").style.display = "none";

  let i = 0;
  function typeEffect() {
    if (i < message.length) {
      const char = message.charAt(i);

      if (char === "\n") {
        endingTextEl.innerHTML += "<br>";
      } else {
        endingTextEl.innerHTML += char === " " ? "&nbsp;" : char;
      }
      i++;
      setTimeout(typeEffect, 90);
    }
  }
  setTimeout(typeEffect, 1000);
}


window.onload = () => {
  document.getElementById("startButton").onclick = () => {
    if (!isMuted) fadeOut(bgmIntro, () => fadeIn(bgmMain));
    document.getElementById("gameTitle").style.display = "none";
    document.getElementById("startButton").style.display = "none";

    const statsBox = document.getElementById("stats");
    statsBox.style.display = "block";
    setTimeout(() => statsBox.classList.add("show"), 50);

    updateStatsDisplay();
    showEvent();
  };

  if (!isMuted) fadeIn(bgmIntro);
};
