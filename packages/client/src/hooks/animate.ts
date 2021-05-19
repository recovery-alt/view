import type { Component } from '@/typings';
import { ComputedRef, shallowReactive } from 'vue';
import { boardRefs } from '@/hooks';

export const useAnimation = (curComponent: ComputedRef<Component>) => {
  const animationPreset = [
    {
      title: '强调',
      data: [
        {
          name: 'bounce',
          label: '弹跳',
        },
        {
          name: 'flash',
          label: '闪烁',
        },
        {
          name: 'pulse',
          label: '放大缩小',
        },
        {
          name: 'rubberBand',
          label: '放大缩小弹簧',
        },
        {
          name: 'shakeX',
          label: '左右晃动',
        },
        {
          name: 'shakeY',
          label: '上下晃动',
        },
        {
          name: 'headShake',
          label: '左右小幅晃动',
        },
        {
          name: 'swing',
          label: '左右扇形摇摆',
        },
        {
          name: 'tada',
          label: '放大晃动缩小',
        },
        {
          name: 'wobble',
          label: '小幅扇形摇摆',
        },
        {
          name: 'jello',
          label: '果冻摇晃',
        },
        {
          name: 'heartBeat',
          label: 'Y轴旋转',
        },
      ],
    },
    {
      title: '延迟',
      data: [
        {
          name: 'backInDown',
          label: '延迟上方进入',
        },
        {
          name: 'backInLeft',
          label: '延迟左侧进入',
        },
        {
          name: 'backInRight',
          label: '延迟右侧进入',
        },
        {
          name: 'backInUp',
          label: '延迟下方进入',
        },
        {
          name: 'backOutDown',
          label: '延迟下方退出',
        },
        {
          name: 'backOutLeft',
          label: '延迟左侧退出',
        },
        {
          name: 'backOutRight',
          label: '延迟右侧退出',
        },
        {
          name: 'backOutUp',
          label: '延迟上方退出',
        },
      ],
    },
    {
      title: '跳跃',
      data: [
        {
          name: 'bounceIn',
          label: '跳跃进入',
        },
        {
          name: 'bounceInDown',
          label: '上方跳跃进入',
        },
        {
          name: 'bounceInLeft',
          label: '左侧跳跃进入',
        },
        {
          name: 'bounceInRight',
          label: '右侧跳跃进入',
        },
        {
          name: 'bounceInUp',
          label: '下方跳跃进入',
        },
        {
          name: 'bounceOut',
          label: '跳跃退出',
        },
        {
          name: 'bounceOutDown',
          label: '下方跳跃退出',
        },
        {
          name: 'bounceOutLeft',
          label: '左侧跳跃退出',
        },
        {
          name: 'bounceOutRight',
          label: '右侧跳跃退出',
        },
        {
          name: 'bounceOutUp',
          label: '上方跳跃退出',
        },
      ],
    },
    {
      title: '淡入/淡出',
      data: [
        {
          name: 'fadeIn',
          label: '淡入',
        },
        {
          name: 'fadeInDown',
          label: '上方淡入',
        },
        {
          name: 'fadeInDownBig',
          label: '上方远距离淡入',
        },
        {
          name: 'fadeInLeft',
          label: '左侧淡入',
        },
        {
          name: 'fadeInLeftBig',
          label: '左侧远距离淡入',
        },
        {
          name: 'fadeInRight',
          label: '右侧淡入',
        },
        {
          name: 'fadeInRightBig',
          label: '右侧远距离淡入',
        },
        {
          name: 'fadeInUp',
          label: '上方淡入',
        },
        {
          name: 'fadeInUpBig',
          label: '上方远距离淡入',
        },
        {
          name: 'fadeInTopLeft',
          label: '左上淡入',
        },
        {
          name: 'fadeInTopRight',
          label: '右上淡入',
        },
        {
          name: 'fadeInBottomLeft',
          label: '左下淡入',
        },
        {
          name: 'fadeInBottomRight',
          label: '右下淡入',
        },
        {
          name: 'fadeOut',
          label: '淡出',
        },
        {
          name: 'fadeOutDown',
          label: '下方淡出',
        },
        {
          name: 'fadeOutDownBig',
          label: '下方远距离淡出',
        },
        {
          name: 'fadeOutLeft',
          label: '左侧淡出',
        },
        {
          name: 'fadeOutLeftBig',
          label: '左侧远距离淡出',
        },
        {
          name: 'fadeOutRight',
          label: '右侧淡出',
        },
        {
          name: 'fadeOutRightBig',
          label: '右侧远距离淡出',
        },
        {
          name: 'fadeOutUp',
          label: '上方淡出',
        },
        {
          name: 'fadeOutUpBig',
          label: '上方远距离淡出',
        },
        {
          name: 'fadeOutTopLeft',
          label: '左上淡出',
        },
        {
          name: 'fadeOutTopRight',
          label: '右上淡出',
        },
        {
          name: 'fadeOutBottomRight',
          label: '左下淡出',
        },
        {
          name: 'fadeOutBottomLeft',
          label: '右下淡出',
        },
      ],
    },
    {
      title: '翻转',
      data: [
        {
          name: 'flip',
          label: '翻转',
        },
        {
          name: 'flipInX',
          label: '横向翻转进入',
        },
        {
          name: 'flipInY',
          label: '纵向翻转进入',
        },
        {
          name: 'flipOutX',
          label: '横向翻转退出',
        },
        {
          name: 'flipOutY',
          label: '纵向翻转退出',
        },
      ],
    },
    {
      title: '光速',
      data: [
        {
          name: 'lightSpeedInRight',
          label: '右侧光速进入',
        },
        {
          name: 'lightSpeedInLeft',
          label: '左侧光速进入',
        },
        {
          name: 'lightSpeedOutRight',
          label: '右侧光速退出',
        },
        {
          name: 'lightSpeedOutLeft',
          label: '左侧光速退出',
        },
      ],
    },
    {
      title: '旋转',
      data: [
        {
          name: 'rotateIn',
          label: '旋转进入',
        },
        {
          name: 'rotateInDownLeft',
          label: '左上旋转进入',
        },
        {
          name: 'rotateInDownRight',
          label: '右上旋转进入',
        },
        {
          name: 'rotateInUpLeft',
          label: '右下旋转进入',
        },
        {
          name: 'rotateInUpRight',
          label: '左下旋转进入',
        },
        {
          name: 'rotateOut',
          label: '旋转退出',
        },
        {
          name: 'rotateOutDownLeft',
          label: '左下旋转退出',
        },
        {
          name: 'rotateOutDownRight',
          label: '右下旋转退出',
        },
        {
          name: 'rotateOutUpLeft',
          label: '左上旋转退出',
        },
        {
          name: 'rotateOutUpRight',
          label: '右上旋转退出',
        },
      ],
    },
    {
      title: '放缩',
      data: [
        {
          name: 'zoomIn',
          label: '放缩进入',
        },
        {
          name: 'zoomInDown',
          label: '上方放缩进入',
        },
        {
          name: 'zoomInLeft',
          label: '左侧放缩进入',
        },
        {
          name: 'zoomInRight',
          label: '右侧放缩进入',
        },
        {
          name: 'zoomInUp',
          label: '下方放缩进入',
        },
        {
          name: 'zoomOut',
          label: '放缩退出',
        },
        {
          name: 'zoomOutDown',
          label: '下方放缩退出',
        },
        {
          name: 'zoomOutLeft',
          label: '左侧放缩退出',
        },
        {
          name: 'zoomOutRight',
          label: '右侧放缩退出',
        },
        {
          name: 'zoomOutUp',
          label: '上方放缩退出',
        },
      ],
    },
    {
      title: '滑动',
      data: [
        {
          name: 'slideInDown',
          label: '上方滑入',
        },
        {
          name: 'slideInLeft',
          label: '左侧滑入',
        },
        {
          name: 'slideInRight',
          label: '右侧滑入',
        },
        {
          name: 'slideInUp',
          label: '下方滑入',
        },
        {
          name: 'slideOutDown',
          label: '下方滑出',
        },
        {
          name: 'slideOutLeft',
          label: '左侧滑出',
        },
        {
          name: 'slideOutRight',
          label: '右侧滑出',
        },
        {
          name: 'slideOutUp',
          label: '上方滑出',
        },
      ],
    },
    {
      title: '特殊',
      data: [
        {
          name: 'hinge',
          label: '悬挂掉落',
        },
        {
          name: 'jackInTheBox',
          label: '下方飞入',
        },
        {
          name: 'rollIn',
          label: '飞入',
        },
        {
          name: 'rollOut',
          label: '飞出',
        },
      ],
    },
  ];

  const drawer = shallowReactive({
    show: false,
    selected: animationPreset[0].title,
    data: animationPreset,
    previewAnimation: '',
  });

  const getAnimationClass = (name: string) => {
    const animation = name === drawer.previewAnimation ? ` animate__animated animate__${name}` : '';
    return animation;
  };

  const handleMouseover = (name: string) => {
    drawer.previewAnimation = name;
  };

  const handleMouseleave = () => {
    drawer.previewAnimation = '';
  };

  const addAnimation = (animation: { name: string; label: string }) => {
    // 没有的时候要新创建
    if (!curComponent.value.animations) curComponent.value.animations = [];
    const { animations } = curComponent.value;
    animations.push({
      ...animation,
      animationDelay: 0,
      animationDuration: 0,
      animationIterationCount: 1,
      repeat: false,
    });
    drawer.show = false;
  };

  const play = (index: number, ref: HTMLElement) => {
    const dom = ref.parentElement || ref;
    return new Promise<void>(resolve => {
      const { animations } = curComponent.value;

      const animated = 'animate__animated';
      const name = `animate__${animations?.[index].name}`;
      dom.classList.add(animated, name);
      const removeAnimation = () => {
        dom.removeEventListener('animationend', removeAnimation);
        dom.removeEventListener('animationcancel', removeAnimation);
        dom.classList.remove(animated, name);
        resolve();
      };

      dom.addEventListener('animationend', removeAnimation);
      dom.addEventListener('animationcancel', removeAnimation);
    });
  };

  const previewAnimation = async (index: number) => {
    const ref = boardRefs[index];
    if (!ref) return;

    if (curComponent.value.animations) {
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
    previewAnimation,
    play,
  };
};
