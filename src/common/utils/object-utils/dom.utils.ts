export const preventSwipePropagation = (event: any) => {
  event.stopPropagation();
};

export const elementPreventSwipePropagation = {
  onTouchStart: preventSwipePropagation,
  onTouchMove: preventSwipePropagation,
  onTouchEnd: preventSwipePropagation,
  onSwipedLeft: preventSwipePropagation,
  onSwipedRight: preventSwipePropagation,
};
