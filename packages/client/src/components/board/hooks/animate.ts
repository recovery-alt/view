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
        'bounce',
        'flash',
        'pulse',
        'rubberBand',
        'shakeX',
        'shakeY',
        'headShake',
        'swing',
        'tada',
        'wobble',
        'jello',
        'heartBeat',
      ],
    },
    {
      title: t('title.delay'),
      data: [
        'backInDown',
        'backInLeft',
        'backInRight',
        'backInUp',
        'backOutDown',
        'backOutLeft',
        'backOutRight',
        'backOutUp',
      ],
    },
    {
      title: t('title.jump'),
      data: [
        'bounceIn',
        'bounceInDown',
        'bounceInLeft',
        'bounceInRight',
        'bounceInUp',
        'bounceOut',
        'bounceOutDown',
        'bounceOutLeft',
        'bounceOutRight',
        'bounceOutUp',
      ],
    },
    {
      title: t('title.fade'),
      data: [
        'fadeIn',
        'fadeInDown',
        'fadeInDownBig',
        'fadeInLeft',
        'fadeInLeftBig',
        'fadeInRight',
        'fadeInRightBig',
        'fadeInUp',
        'fadeInUpBig',
        'fadeInTopLeft',
        'fadeInTopRight',
        'fadeInBottomLeft',
        'fadeInBottomRight',
        'fadeOut',
        'fadeOutDown',
        'fadeOutDownBig',
        'fadeOutLeft',
        'fadeOutLeftBig',
        'fadeOutRight',
        'fadeOutRightBig',
        'fadeOutUp',
        'fadeOutUpBig',
        'fadeOutTopLeft',
        'fadeOutTopRight',
        'fadeOutBottomRight',
        'fadeOutBottomLeft',
      ],
    },
    {
      title: t('title.rotate'),
      data: ['flip', 'flipInX', 'flipInY', 'flipOutX', 'flipOutY'],
    },
    {
      title: t('title.lightSpeed'),
      data: ['lightSpeedInRight', 'lightSpeedInLeft', 'lightSpeedOutRight', 'lightSpeedOutLeft'],
    },
    {
      title: t('title.rotate'),
      data: [
        'rotateIn',
        'rotateInDownLeft',
        'rotateInDownRight',
        'rotateInUpLeft',
        'rotateInUpRight',
        'rotateOut',
        'rotateOutDownLeft',
        'rotateOutDownRight',
        'rotateOutUpLeft',
        'rotateOutUpRight',
      ],
    },
    {
      title: t('title.zoom'),
      data: [
        'zoomIn',
        'zoomInDown',
        'zoomInLeft',
        'zoomInRight',
        'zoomInUp',
        'zoomOut',
        'zoomOutDown',
        'zoomOutLeft',
        'zoomOutRight',
        'zoomOutUp',
      ],
    },
    {
      title: t('title.slide'),
      data: [
        'slideInDown',
        'slideInLeft',
        'slideInRight',
        'slideInUp',
        'slideOutDown',
        'slideOutLeft',
        'slideOutRight',
        'slideOutUp',
      ],
    },
    {
      title: t('title.special'),
      data: ['hinge', 'jackInTheBox', 'rollIn', 'rollOut'],
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

  return {
    drawer,
    handleMouseover,
    handleMouseleave,
    getAnimationClass,
    addAnimation,
  };
};
