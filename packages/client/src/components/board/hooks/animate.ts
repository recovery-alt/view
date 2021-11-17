import type { Component } from '@/typings';
import { shallowReactive } from 'vue';
import { v4 } from 'uuid';
import { useI18n } from 'vue-i18n';
import { animatePanel as messages } from '@/locales';

export const useAnimation = (curCom: Component) => {
  const { t } = useI18n({ useScope: 'local', messages });

  const animationPreset = [
    {
      title: t('title.emphasis'),
      data: [
        {
          name: 'bounce',
          label: t('animations.bounce'),
        },
        {
          name: 'flash',
          label: t('animations.flash'),
        },
        {
          name: 'pulse',
          label: t('animations.pulse'),
        },
        {
          name: 'rubberBand',
          label: t('animations.rubberBand'),
        },
        {
          name: 'shakeX',
          label: t('animations.shakeX'),
        },
        {
          name: 'shakeY',
          label: t('animations.shakeY'),
        },
        {
          name: 'headShake',
          label: t('animations.headShake'),
        },
        {
          name: 'swing',
          label: t('animations.swing'),
        },
        {
          name: 'tada',
          label: t('animations.tada'),
        },
        {
          name: 'wobble',
          label: t('animations.wobble'),
        },
        {
          name: 'jello',
          label: t('animations.jello'),
        },
        {
          name: 'heartBeat',
          label: t('animations.heartBeat'),
        },
      ],
    },
    {
      title: t('title.delay'),
      data: [
        {
          name: 'backInDown',
          label: t('animations.backInDown'),
        },
        {
          name: 'backInLeft',
          label: t('animations.backInLeft'),
        },
        {
          name: 'backInRight',
          label: t('animations.backInRight'),
        },
        {
          name: 'backInUp',
          label: t('animations.backInUp'),
        },
        {
          name: 'backOutDown',
          label: t('animations.backOutDown'),
        },
        {
          name: 'backOutLeft',
          label: t('animations.backOutLeft'),
        },
        {
          name: 'backOutRight',
          label: t('animations.backOutRight'),
        },
        {
          name: 'backOutUp',
          label: t('animations.backOutUp'),
        },
      ],
    },
    {
      title: t('title.jump'),
      data: [
        {
          name: 'bounceIn',
          label: t('animations.bounceIn'),
        },
        {
          name: 'bounceInDown',
          label: t('animations.bounceInDown'),
        },
        {
          name: 'bounceInLeft',
          label: t('animations.bounceInLeft'),
        },
        {
          name: 'bounceInRight',
          label: t('animations.bounceInRight'),
        },
        {
          name: 'bounceInUp',
          label: t('animations.bounceInUp'),
        },
        {
          name: 'bounceOut',
          label: t('animations.bounceOut'),
        },
        {
          name: 'bounceOutDown',
          label: t('animations.bounceOutDown'),
        },
        {
          name: 'bounceOutLeft',
          label: t('animations.bounceOutLeft'),
        },
        {
          name: 'bounceOutRight',
          label: t('animations.bounceOutRight'),
        },
        {
          name: 'bounceOutUp',
          label: t('animations.bounceOutUp'),
        },
      ],
    },
    {
      title: t('title.fade'),
      data: [
        {
          name: 'fadeIn',
          label: t('animations.fadeIn'),
        },
        {
          name: 'fadeInDown',
          label: t('animations.fadeInDown'),
        },
        {
          name: 'fadeInDownBig',
          label: t('animations.fadeInDownBig'),
        },
        {
          name: 'fadeInLeft',
          label: t('animations.fadeInLeft'),
        },
        {
          name: 'fadeInLeftBig',
          label: t('animations.fadeInLeftBig'),
        },
        {
          name: 'fadeInRight',
          label: t('animations.fadeInRight'),
        },
        {
          name: 'fadeInRightBig',
          label: t('animations.fadeInRightBig'),
        },
        {
          name: 'fadeInUp',
          label: t('animations.fadeInUp'),
        },
        {
          name: 'fadeInUpBig',
          label: t('animations.fadeInUpBig'),
        },
        {
          name: 'fadeInTopLeft',
          label: t('animations.fadeInTopLeft'),
        },
        {
          name: 'fadeInTopRight',
          label: t('animations.fadeInTopRight'),
        },
        {
          name: 'fadeInBottomLeft',
          label: t('animations.fadeInBottomLeft'),
        },
        {
          name: 'fadeInBottomRight',
          label: t('animations.fadeInBottomRight'),
        },
        {
          name: 'fadeOut',
          label: t('animations.fadeOut'),
        },
        {
          name: 'fadeOutDown',
          label: t('animations.fadeOutDown'),
        },
        {
          name: 'fadeOutDownBig',
          label: t('animations.fadeOutDownBig'),
        },
        {
          name: 'fadeOutLeft',
          label: t('animations.fadeOutLeft'),
        },
        {
          name: 'fadeOutLeftBig',
          label: t('animations.fadeOutLeftBig'),
        },
        {
          name: 'fadeOutRight',
          label: t('animations.fadeOutRight'),
        },
        {
          name: 'fadeOutRightBig',
          label: t('animations.fadeOutRightBig'),
        },
        {
          name: 'fadeOutUp',
          label: t('animations.fadeOutUp'),
        },
        {
          name: 'fadeOutUpBig',
          label: t('animations.fadeOutUpBig'),
        },
        {
          name: 'fadeOutTopLeft',
          label: t('animations.fadeOutTopLeft'),
        },
        {
          name: 'fadeOutTopRight',
          label: t('animations.fadeOutTopRight'),
        },
        {
          name: 'fadeOutBottomRight',
          label: t('animations.fadeOutBottomRight'),
        },
        {
          name: 'fadeOutBottomLeft',
          label: t('animations.fadeOutBottomLeft'),
        },
      ],
    },
    {
      title: t('title.rotate'),
      data: [
        {
          name: 'flip',
          label: t('animations.flip'),
        },
        {
          name: 'flipInX',
          label: t('animations.flipInX'),
        },
        {
          name: 'flipInY',
          label: t('animations.flipInY'),
        },
        {
          name: 'flipOutX',
          label: t('animations.flipOutX'),
        },
        {
          name: 'flipOutY',
          label: t('animations.flipOutY'),
        },
      ],
    },
    {
      title: t('title.lightSpeed'),
      data: [
        {
          name: 'lightSpeedInRight',
          label: t('animations.lightSpeedInRight'),
        },
        {
          name: 'lightSpeedInLeft',
          label: t('animations.lightSpeedInLeft'),
        },
        {
          name: 'lightSpeedOutRight',
          label: t('animations.lightSpeedOutRight'),
        },
        {
          name: 'lightSpeedOutLeft',
          label: t('animations.lightSpeedOutLeft'),
        },
      ],
    },
    {
      title: t('title.rotate'),
      data: [
        {
          name: 'rotateIn',
          label: t('animations.rotateIn'),
        },
        {
          name: 'rotateInDownLeft',
          label: t('animations.rotateInDownLeft'),
        },
        {
          name: 'rotateInDownRight',
          label: t('animations.rotateInDownRight'),
        },
        {
          name: 'rotateInUpLeft',
          label: t('animations.rotateInUpLeft'),
        },
        {
          name: 'rotateInUpRight',
          label: t('animations.rotateInUpRight'),
        },
        {
          name: 'rotateOut',
          label: t('animations.rotateOut'),
        },
        {
          name: 'rotateOutDownLeft',
          label: t('animations.rotateOutDownLeft'),
        },
        {
          name: 'rotateOutDownRight',
          label: t('animations.rotateOutDownRight'),
        },
        {
          name: 'rotateOutUpLeft',
          label: t('animations.rotateOutUpLeft'),
        },
        {
          name: 'rotateOutUpRight',
          label: t('animations.rotateOutUpRight'),
        },
      ],
    },
    {
      title: t('title.zoom'),
      data: [
        {
          name: 'zoomIn',
          label: t('animations.zoomIn'),
        },
        {
          name: 'zoomInDown',
          label: t('animations.zoomInDown'),
        },
        {
          name: 'zoomInLeft',
          label: t('animations.zoomInLeft'),
        },
        {
          name: 'zoomInRight',
          label: t('animations.zoomInRight'),
        },
        {
          name: 'zoomInUp',
          label: t('animations.zoomInUp'),
        },
        {
          name: 'zoomOut',
          label: t('animations.zoomOut'),
        },
        {
          name: 'zoomOutDown',
          label: t('animations.zoomOutDown'),
        },
        {
          name: 'zoomOutLeft',
          label: t('animations.zoomOutLeft'),
        },
        {
          name: 'zoomOutRight',
          label: t('animations.zoomOutRight'),
        },
        {
          name: 'zoomOutUp',
          label: t('animations.zoomOutUp'),
        },
      ],
    },
    {
      title: t('title.slide'),
      data: [
        {
          name: 'slideInDown',
          label: t('animations.slideInDown'),
        },
        {
          name: 'slideInLeft',
          label: t('animations.slideInLeft'),
        },
        {
          name: 'slideInRight',
          label: t('animations.slideInRight'),
        },
        {
          name: 'slideInUp',
          label: t('animations.slideInUp'),
        },
        {
          name: 'slideOutDown',
          label: t('animations.slideOutDown'),
        },
        {
          name: 'slideOutLeft',
          label: t('animations.slideOutLeft'),
        },
        {
          name: 'slideOutRight',
          label: t('animations.slideOutRight'),
        },
        {
          name: 'slideOutUp',
          label: t('animations.slideOutUp'),
        },
      ],
    },
    {
      title: t('title.special'),
      data: [
        {
          name: 'hinge',
          label: t('animations.hinge'),
        },
        {
          name: 'jackInTheBox',
          label: t('animations.jackInTheBox'),
        },
        {
          name: 'rollIn',
          label: t('animations.rollIn'),
        },
        {
          name: 'rollOut',
          label: t('animations.rollOut'),
        },
      ],
    },
  ];

  const drawer = shallowReactive({
    show: false,
    selected: animationPreset[0].title,
    data: animationPreset,
    curAnimation: '',
  });

  const getAnimationClass = (name: string) => {
    const animation = name === drawer.curAnimation ? ` animate__animated animate__${name}` : '';
    return animation;
  };

  const handleMouseover = (name: string) => {
    drawer.curAnimation = name;
  };

  const handleMouseleave = () => {
    drawer.curAnimation = '';
  };

  const addAnimation = (animation: { name: string; label: string }) => {
    // 没有的时候要新创建
    if (!curCom.animations) curCom.animations = [];
    const { animations } = curCom;
    animations.push({
      id: v4(),
      ...animation,
      animationDelay: 0,
      animationDuration: 1,
      animationIterationCount: 1,
      repeat: false,
    });
    drawer.show = false;
  };

  const play = async (index: number, dom: HTMLElement) => {
    return new Promise<void>(resolve => {
      const { animations } = curCom;

      if (!animations?.[index]) return resolve();

      const {
        name: animate,
        animationDelay,
        animationDuration,
        animationIterationCount,
      } = animations[index];

      const animated = 'animate__animated';
      const name = `animate__${animate}`;
      dom.style.animationDelay = `${animationDelay}s`;
      dom.style.animationDuration = `${animationDuration}s`;
      dom.style.animationIterationCount = `${animationIterationCount}`;
      dom.classList.add(animated, name);
      const removeAnimation = () => {
        dom.removeEventListener('animationend', removeAnimation);
        dom.removeEventListener('animationcancel', removeAnimation);
        dom.style.animationDelay = '';
        dom.style.animationDuration = '';
        dom.style.animationIterationCount = '';
        dom.classList.remove(animated, name);
        resolve();
      };

      dom.addEventListener('animationend', removeAnimation);
      dom.addEventListener('animationcancel', removeAnimation);
    });
  };

  const playAll = async (ref: HTMLElement) => {
    if (!ref) return;
    if (curCom.animations) {
      for (let i = 0; i < animationPreset.length; i++) {
        await play(i, ref);
      }
    }
  };

  return {
    drawer,
    handleMouseover,
    handleMouseleave,
    getAnimationClass,
    addAnimation,
    playAll,
    play,
  };
};
