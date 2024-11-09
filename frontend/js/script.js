"use strict"

document.addEventListener("DOMContentLoaded", () => {
  // tabs start
  const tabHeaders = document.querySelectorAll(".tabheader__item");
  const tabHeadersParent = document.querySelector(".tabheader__items");
  const tabContents = document.querySelectorAll(".tabcontent");

  function hideTabContent() {
    tabContents.forEach(item => {
      item.classList.add("hide");
      item.classList.remove("show", "fade");
    });

    tabHeaders.forEach(item => {
      item.classList.remove("tabheader__item_active");
    });
  }

  function showTabContent(i = 0) {
    tabContents[i].classList.add("show", "fade");
    tabContents[i].classList.remove("hide");
    tabHeaders[i].classList.add("tabheader__item_active");
  }

  hideTabContent();
  showTabContent();

  tabHeadersParent.addEventListener("click", (e) => {
    if (e.target && e.target.matches(".tabheader__item")) {
      tabHeaders.forEach((item, index) => {
        if (e.target == item) {
          hideTabContent();
          showTabContent(index);
        }
      });
    }
  });
  // tabs end

  // timer start
  const deadline = "2024-12-31 23:59";

  const setZero = n => n >= 0 && n < 10 ? `0${n}` : n; 

  function getTimeRemaining(endtime) {
    let days, hours, minutes, seconds;
    const total = Date.parse(endtime) - Date.parse(new Date());

    if (total <= 0) {
      days = 0;
      hours = 0;
      minutes = 0;
      seconds = 0;
    }
    
    else {
      days = Math.floor(total / (1000 * 60 * 60 * 24));
      hours =  Math.floor((total / (1000 * 60 * 60) % 24));
      minutes = Math.floor((total / 1000 / 60) % 60);
      seconds = Math.floor((total / 1000) % 60);
    }

    return { total, days, hours, minutes, seconds};
  }

  function setTimer(selector, endtime) {
    const timer = document.querySelector(selector);
    const daysElem = timer.querySelector("#days");
    const hoursElem = timer.querySelector("#hours");
    const minutesElem = timer.querySelector("#minutes");
    const secondsElem = timer.querySelector("#seconds");

    const timerID = setInterval(updateTimer, 1000);
    
    updateTimer();

    function updateTimer() {
      const { total, days, hours, minutes, seconds } = getTimeRemaining(endtime);
      daysElem.innerHTML = setZero(days);
      hoursElem.innerHTML = setZero(hours);
      minutesElem.innerHTML = setZero(minutes);
      secondsElem.innerHTML = setZero(seconds);

      if (total <= 0) {
        clearInterval(timerID);
      }
    }
  }

  setTimer(".timer", deadline);
  // timer end

  // modal start
  const modalOpenTriggers = document.querySelectorAll("[data-modal-trigger]");
  const modal = document.querySelector(".modal");

  function showModal() {
    modal.classList.remove("hide");
    modal.classList.add("show");
    document.body.style.overflowY = "hidden";
    clearTimeout(modalTimerID);
  }

  function closeModal() {
    modal.classList.remove("show");
    modal.classList.add("hide");
    document.body.style.overflowY = "auto";
  }

  modalOpenTriggers.forEach(btn => btn.addEventListener("click", showModal));
  modal.addEventListener("click", (e) => {
    if (e.target && e.target === modal || e.target.getAttribute("data-modal-close") == "") {
      closeModal();
    }
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.matches(".show")) {
      closeModal();
    }
  });

  const modalTimerID = setTimeout(showModal, 60000);

  function showModalByScroll() {
    if (window.scrollY + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
      showModal();
      window.removeEventListener("scroll", showModalByScroll);
    }
  }

  window.addEventListener("scroll", showModalByScroll);
  // modal end

  // menu start
  class MenuCard {
    constructor(imgSrc, title, descr, price) {
      this.imgSrc = imgSrc;
      this.title = title;
      this.descr = descr;
      this.price = price;
      this.transfer = 41.22;
      this.changeToUAH();
    }

    changeToUAH() {
      // this.price = this.price * this.transfer;
      this.price *= this.transfer;
    }

    render () {
      const elem = document.querySelector(".menu__field .container");
      const { imgSrc, title, descr, price } = this;
      elem.innerHTML += `
        <div class="menu__item">
          <img src="${imgSrc}" alt="${title}">
          <h3 class="menu__item-subtitle">${title}</h3>
          <div class="menu__item-descr">${descr}</div>
          <div class="menu__item-divider"></div>
          <div class="menu__item-price">
            <div class="menu__item-cost">Цена:</div>
            <div class="menu__item-total"><span>${price.toFixed(2)}</span> грн/день</div>
          </div>
        </div>
      `;
    }
  }

  getData("http://localhost:8888/get-menu")
    .then(data => {
      data.map(({ image, title, description, price }) => {
        return new MenuCard(`img/tabs/${image}`, title, description, price).render()
      })
    })

  // axios.get("http://localhost:8888/get-men")
  //   .then(({ data }) => {
  //     console.log(data);
  //     data.map(({ image, title, description, price }) => {
  //       return new MenuCard(`img/tabs/${image}`, title, description, price).render()
  //     })
  //   })
  //   .catch(e => console.log(e.message));
  // menu end

  // forms

  const forms = document.querySelectorAll("form");

  const messages = {
    loading: "<span class=\"loader\"></span>",
    success: "Success...",
    failure: "Failure..."
  };

  forms.forEach(form => addUserInfo(form));

  function addUserInfo(form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const statusMessage = document.createElement("p");
      statusMessage.classList.add("status_message");
      statusMessage.innerHTML = messages.loading;
      form.append(statusMessage);

      postData("http://localhost:8888/add-user-info/", new FormData(form))
        .then(data => {
          console.log(data);
          statusMessage.textContent = messages.success;
          statusMessage.remove();
          showResponseModal(messages.success);
        })
        .catch(e => {
          showResponseModal(messages.failure);
          console.log(e);
        })
        .finally(() => form.reset());
    });
  }

  function showResponseModal(message) {
    const prevModalDialog = document.querySelector(".modal__dialog");
    prevModalDialog.classList.add("hide");
    showModal();

    const showResponseModalElem = document.createElement("div");
    showResponseModalElem.classList.add("modal__dialog");
    showResponseModalElem.innerHTML = `
      <div class="modal__content">
        <div data-modal-close="" class="modal__close">×</div>
        <div class="modal__title">${message}</div>
      </div>
    `;

    document.querySelector(".modal").append(showResponseModalElem);

    setTimeout(() => {
      showResponseModalElem.remove();
      prevModalDialog.classList.remove("hide");
      prevModalDialog.classList.add("show");
      closeModal();
    }, 1500);
  }

  async function postData(url, data) {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(Object.fromEntries(data))
    });

    return await res.json();
  }

  async function getData(url) {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Error: ${res.statusText}`);
    }

    return res.json();
  }
});