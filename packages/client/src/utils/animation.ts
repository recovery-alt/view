import { Animation } from '@/typings';

export const playAnimation = async (dom: HTMLElement, animation: Animation) => {
  return new Promise<void>(resolve => {
    const { name: animate, animationDelay, animationDuration, animationIterationCount } = animation;

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

export const playAnimations = async (ref: HTMLElement, animations?: Animation[]) => {
  if (!animations) return;
  for (let i = 0; i < animations.length; i++) {
    await playAnimation(ref, animations[i]);
  }
};
