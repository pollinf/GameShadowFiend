let timerBlock = document.getElementById("timer");
class Game {
    constructor() {
        this.name = name;
        this.$zone = $('.elements');
        this.elements = [];
        this.player = this.generate(Player);
        this.fruits = [blink, tango, eul];
        this.counterForTimer = 0;
        this.points = 0;
        this.hp = 3;
        this.time = {
            m1: 0,
            m2: 0,
            s1: 0,
            s2: 0,
        };
        this.ended = false;
        this.pause = false;
        this.idAnimate;
        this.keyEvents();
    }

    keyEvents() {
            addEventListener('keydown', (e) => {
                    if (e.key === "Escape") {
                            if(!this.pause){
                              this.pause = true;
                              this.elements.forEach((item) => {
                                item.$element[0].classList.remove("animate");
                              });
                            }
                            else{
                              this.pause = false;
                                this.loop();
                                this.elements.forEach((item) => {
                                item.$element[0].classList.add("animate");
                                });
                            }
                    }
            })
    }
    start() {
        this.loop();
    }

    loop() {
      this.idAnimate = requestAnimationFrame(() => {
            if (!this.pause) {
                      this.counterForTimer++;
            if (this.counterForTimer % 60 === 0) {
                this.timer();
                this.randomFruitGenerate();
            }
            if (this.hp <= 0) {
                    this.end();
            }
            $('.pause').css('display', 'none').hide().fadeOut();
            this.updateElements();
            this.setParams();
          } else if (this.pause) {
                  $('.pause').css('display', 'flex').show().fadeIn();

                  return;
          }
            if (!this.ended) {
                    this.loop();
            }
        })
        this.updateElements();
        this.setParams();
    }


    end() {
      this.ended = true;
      let time = this.time;
      if (time.s1 >= 4 || time.m2 >= 4 || time.m1 >= 4) {
          $('#playerName').html(`Победа, ${this.name}!`);
          $('#endTime').html(`Вы снесли трон на: ${time.m1}${time.m2}:${time.s1}${time.s2}`);
          $('#collectedFruits').html(`Вы затаймили ${this.points} реквиемов`);
          $('#congratulation').html(`Вы сделали рампагу!`);
      } else {
        $('#playerName').html(`Тима заруинила, ${this.name}!`);
        $('#endTime').html(`Вам снесли трон на: ${time.m1}${time.m2}:${time.s1}${time.s2}`);
        $('#collectedFruits').html(`Вы затаймили ${this.points} реквиемов`);
        $('#congratulation').html(`Снова -25`);
      }
      go('end', 'panel d-flex justify-content-center align-items-center');
    }



    setParams() {
        let params = ['name', 'points', 'hp'];
        let value = [this.name, this.points, this.hp];
        params.forEach((e, i) => {
            $(`#${e}`).html(value[i]);
        })
    }

    updateElements() {
        this.elements.forEach(e => {
            e.update();
            e.draw();
        })
    }

    generate(className) {
        let element = new className(this);
        this.elements.push(element);
        return element;
    }

    randomFruitGenerate() {
        let ranFruit = random(0, 2);
        this.generate(this.fruits[ranFruit]);
    }

    remove(el) {
        let idx = this.elements.indexOf(el);
        if (idx !== -1) {
            this.elements.splice(idx, 1);
            return true;
        }
        return false;
    }

    timer() {
        this.time.s2++;
        if (this.time.s2 >= 10) {
            this.time.s2 = 0;
            this.time.s1++;
        }
        if (this.time.s1 >= 6) {
            this.time.s1 = 0;
            this.time.m2++;
        }
        if (this.time.m2 >= 10) {
            this.time.m2 = 0;
            this.time.m1++;
        }
        let str = `${this.time.m1}${this.time.m2}:${this.time.s1}${this.time.s2}`;
        timerBlock.innerHTML = str;
    }
}
    class Drawable {
    constructor(game) {
        this.game = game;
        this.x = 0;
        this.y = 0;
        this.h = 0;
        this.w = 0;
        this.offsets = {
            x: 0,
            y: 0
        }
    }
    createElements() {
        this.$element = $(`<div class="element animate ${this.constructor.name.toLowerCase()}"></div>`);
        this.game.$zone.append(this.$element);
    }

    update() {
        this.x += this.offsets.x;
        this.y += this.offsets.y;
    }

    draw() {
        this.$element.css({
            left: this.x + "px",
            top: this.y + "px",
            width: this.w + "px",
            height: this.h + "px"
        })
    }

    isCollision(element) {
        let a = {
            x1: this.x,
            x2: this.x + this.w,
            y1: this.y,
            y2: this.y + this.h,
        };
        let b = {
            x1: element.x,
            x2: element.x + element.w,
            y1: element.y,
            y2: element.y + element.h,
        };
        return a.x1 < b.x2 && b.x1 < a.x2 && a.y1 < b.y2 && b.y1 < a.y2;
    }

    removeElement() {
        this.$element.remove();
    }
}

class Player extends Drawable {
    constructor(game) {
        super(game);
        this.w = 154;
        this.h = 109;
        this.x = this.game.$zone.width() / 2 - this.w / 2;
        this.y = this.game.$zone.height() - this.h;
        this.speedPerFrame = 20;
        this.skillTimer = 0;
        this.couldTimer = 0;
        this.keys = {
            ArrowLeft: false,
            ArrowRight: false,
            Space: false
        };
        this.createElements();
        this.bindKeyEvents();
    }


  applySkill() {
      for (let i = 1; i < this.game.elements.length; i++) {
          if (this.game.elements[i].x < this.x + (this.w / 2)) {
              this.game.elements[i].x += 15;
          } else if (this.game.elements[i].x > this.x + (this.w / 2)) {
              this.game.elements[i].x -= 15;
          }
      }
  }


    bindKeyEvents() {
        document.addEventListener('keydown', ev => this.changeKeyStatus(ev.code, true));
        document.addEventListener('keyup', ev => this.changeKeyStatus(ev.code, false));
    }

    changeKeyStatus(code, value) {
        if (code in this.keys) {
            this.keys[code] = value;
        }
    }

    update() {
        if (this.keys.ArrowLeft && this.x > 0) {
            this.offsets.x = -this.speedPerFrame;
        } else if (this.keys.ArrowRight && this.x < this.game.$zone.width() - this.w) {
            this.offsets.x = this.speedPerFrame;
        } else {
            this.offsets.x = 0;
        }
        if (this.keys.Space && this.couldTimer === 0) {
            this.skillTimer++;
            $('#skill').html(`осталось ${Math.ceil((240 - this.skillTimer) / 60)}`);
            this.applySkill();
        }
        if (this.skillTimer > 240 || (!this.keys.Space && this.skillTimer > 1)) {
            this.couldTimer++;
            $('#skill').html(`в откате ещё ${Math.ceil((300 - this.couldTimer) / 60)}`);
            this.keys.Space = false;
        }
        if(this.couldTimer > 300){
          this.couldTimer = 0;
          this.skillTimer = 0;
          $('#skill').html('Готово');
        }
        super.update();
    }
}

class Fruits extends Drawable {
    constructor(game) {
        super(game);
        this.w = 70;
        this.h = 70;
        this.x = random(0, this.game.$zone.width() - this.w);
        this.y = 60;
        this.offsets.y = 3;
        this.createElements();
    }

    update() {
        if (this.isCollision(this.game.player) && this.offsets.y > 0) {
            this.takePoint(this.game.element);
        }
        if (this.y > this.game.$zone.height()) {
            this.takeDamage(this.game.element)
        }
        super.update();
    }

    takePoint() {
        if (this.game.remove(this)) {
            this.removeElement();
            this.game.points++;
        }
    }

    takeDamage() {
        if (this.game.remove(this)) {
            this.removeElement();
            this.game.hp--;
            }
    }
}

class blink
    extends Fruits {
    constructor(game) {
        super(game);
        this.offsets.y = 6;
    }
}

class tango extends Fruits {
    constructor(game) {
        super(game);
        this.offsets.y = 5;
    }
}

class eul extends Fruits {
    constructor(game) {
        super(game);
        this.offsets.y = 7;
    }


}

let random = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
};

window
    .onload = () => {
    checkStorage();
    nav();
    startLoop();
    setInterval(() => {
        if (panel === "game") {
            game.game = new Game();
            game.game.start();
            panel = "game process";
        }
    }, 500)
}
