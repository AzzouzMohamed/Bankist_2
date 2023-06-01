'use strict';

///////////////////////////////////////

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const allSections = document.querySelectorAll('.section');

// Modal window
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//Button Scrolling
btnScrollTo.addEventListener('click', e => {
  section1.scrollIntoView({
    behavior: 'smooth',
  });
});

//Page Navigation

//Redondant work => Solition event delegation
/* document.querySelectorAll('.nav__link').forEach(function (el) {
  el.addEventListener('click', function (e) {
    e.preventDefault();
    const id = this.getAttribute('href');
    console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  });
});
 */

//Event Delegation

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  //Matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});
//Tabbed Componenet

//here we gonna use Event delegation :
tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  //Guard Clause
  if (!clicked) return;

  //remove Classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(t => t.classList.remove('operations__content--active'));

  //Active tab
  clicked.classList.add('operations__tab--active');

  //Activate Content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//Menu Fade animation

const handleHover = function (e) {
  const link = e.target;
  if (link.classList.contains('nav__link')) {
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
    siblings.forEach(el => {
      if (el !== link) {
        el.style.opacity = this;
      }
    });
  }
  logo.style.opacity = this;
};

// Passing "argument " into handler in callback function , functions are allowed to have one argument and that events here , if we want to pass arg by this
nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));
/// Sticky Navigation
//Bad Practice Consume CPu
/* const initialCoords = section1.getBoundingClientRect();
window.addEventListener('scroll', function () {
  if (window.scrollY > initialCoords.top) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
}); */

//Sticky Navigation : Intersection Observer APi

/* const obsCallback = function (entries, observer) {
  entries.forEach(entry => console.log(entry));
};

const obsOptions = {
  root: null, //Element the target Intersectiong
  threshold: [0, 0.2], ///Threshold, and this is basically the percentageof intersection at which the observer callback will be called
};

const observer = new IntersectionObserver(obsCallback, obsOptions);
observer.observe(section1); */

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const obsOptions = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
};
const headerObserver = new IntersectionObserver(stickyNav, obsOptions);

headerObserver.observe(header);

//Reveal Sections
const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  //To better the porformance
  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.2,
});

allSections.forEach(section => {
  sectionObserver.observe(section);
  /*   section.classList.add('section--hidden');
   */
});
//Lazy loading Images
const imgTargets = document.querySelectorAll('img[data-src]');
const loadImg = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  //Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
});

imgTargets.forEach(img => imgObserver.observe(img));

///Slider
const sliderr = function () {
  const slider = document.querySelector('.slider');
  const slides = document.querySelectorAll('.slide');
  const btnRight = document.querySelector('.slider__btn--right');
  const btnLeft = document.querySelector('.slider__btn--left');
  const dotContainer = document.querySelector('.dots');
  const maxSlide = slides.length;
  let curSlide = 0;
  /* slider.style.transform = 'scale(0.4) translateX(-10%)';
slider.style.overflow = 'visible'; */

  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class = "dots__dot" data-slide = "${i}"></button>`
      );
    });
  };
  const activateDot = function (slide) {
    document.querySelectorAll('.dots__dot').forEach(dot => {
      dot.classList.remove('dots__dot--active');
    });

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };
  const goToSlide = function (slides, curSlide) {
    return slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - curSlide)}%)`)
    );
  };

  //Next slide

  const init = function () {
    createDots();
    goToSlide(slides, 0);
    activateDot(0);
  };

  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    goToSlide(slides, curSlide);
    activateDot(curSlide);
  };

  const previouSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(slides, curSlide);
    activateDot(curSlide);
  };

  init();

  //Event Handlers

  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', previouSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') previouSlide();
    if (e.key === 'ArrowRight') nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slides, slide);
      activateDot(slide);
    }
  });
};
sliderr();

//Going downward: Child
/* const h1 = document.querySelector('h1');
console.log(h1.querySelectorAll('.highlight'));
console.log(h1.children);
console.log(h1.childNodes);
h1.firstElementChild.style.color = 'white';
h1.lastElementChild.style.color = 'orangered'; */

//Going upwards: parents

/* console.log(h1.parentNode);
console.log(h1.parentElement);
h1.closest('.header').style.background = 'var(--gradient-secondary)';
 */
//Going Sideways : siblings
/* console.log(h1.previousElementSibling);
  console.log(h1.nextElementSibling);
  console.log(h1.previousSibling);
  console.log(h1.nextSibling);
  console.log(h1.parentElement.children);
 */
///////////////////////////lectures
/* console.log(document.documentElement);
const allSections = document.querySelectorAll('.section');
console.log(allSections);

const allButtons = document.getElementsByTagName('button');
console.log(allButtons);
 */
//Creating and inserting elements
//.insertAdjacentHTML
/* const header = document.querySelector('.header');

const message = document.createElement('div');
message.classList.add('cookie-message');
message.innerHTML =
  'We use cookied for imporved functionality and analytics. <button class="btn btn--close-cookie"> Got it ! </button>';

header.append(message); */

/* header.before(message);
 */

/* document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    message.remove();
  });

message.style.backgroundColor = '#37383d';
message.style.width = '120%';

message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 40 + 'px'; */

/* 
document.documentElement.style.setProperty('--color-primary', 'orangered');

//Attributes

const logo = document.querySelector('.nav__logo');
console.log(logo.alt);
console.log(logo.getAttribute('designer'));
console.log(logo.setAttribute('campany', ' Bankist'));

//Data attributes
console.log(logo.dataset.versionNumber);

//Classess
logo.classList.add();
logo.classList.remove();
logo.classList.toggle();
logo.classList.contains();
 */

/* 
/*
const h1 = document.querySelector('h1');

//The differnce between addEventListener and onfunction is that we can remove the evenListener
const alert1 = function (e) {
  alert('addEventListener : Great ! You are readin the heading ');

  /*   h1.removeEventListener('mouseenter', alert1);
   */
//};
/*h1.addEventListener('mouseenter', alert1);

setTimeout(() => h1.removeEventListener('mouseenter', alert1), 3000);
//Old School
/* 
h1.onmouseenter = e => {
  alert('eeee');
}; */

// rgb(255 , 255 , 255)
/*const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const randomColor = () =>
  `rgb( ${randomInt(0, 255)}, ${randomInt(0, 255)} , ${randomInt(0, 255)})`;

document.querySelector('.nav__link').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log(`Link`, e.target, e.currentTarget);

  //STOP propagation
  // It s not a good idea to stop even prop it may occur error 
  // e.stopPropagation();
});

//target win sar el event

document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log(`Container`, e.target, e.currentTarget);
});

document.querySelector('.nav').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log(`Nav`, e.target, e.currentTarget);
});
*/

/*** 
btnScrollTo.addEventListener('click', e => {
  //Position of Sections1
  const s1coords = section1.getBoundingClientRect();
  /*   console.log(s1coords);
   */ //Position of Button
/*   console.log(e.target.getBoundingClientRect());
 */
//Scorll for the start of page
/*   console.log('Current Scroll( X/Y)', window.pageXOffset, window.pageYOffset);
 */
//The size of viewport right now
/*  console.log(
    `height/width veiwport`,
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  ); */

/*  //Scrolling
  window.scrollTo(
    s1coords.left + window.pageYOffset,
    s1coords.top + window.pageXOffset
  );

  //Scrolling
  window.scrollTo({
    left: s1coords.left + window.pageXOffset,
    top: s1coords.top + window.pageYOffset,
    behavior: 'smooth',
  });
 */
//Modern Way of doing this
/*   section1.scrollIntoView({
    behavior: 'smooth',
  });
}); */

//Wait until Jtml and js loaded
document.addEventListener('DOMContentLoaded', function (e) {
  console.log(`HTML Parsed and Dom tree build !! `, e);
});

//Wait until everything is loaded
window.addEventListener('load', function (e) {
  console.log(`Page fully laoded`, e);
});

//Pop up a message before closing the chrome tab
window.addEventListener('beforeunload ', function (e) {
  e.preventDefault();
  console.log(e);
});
