import DynamicIcons from "~/components/shared/DynamicIcons";

export const RatingStarsView = (props: { rating: number }) => {
  const { rating } = props;
  const roundedRating = Math.round(rating * 10) / 10;
  const roundedRatingNear0_5 = Math.round(rating * 2) / 2;
  const fullStars = Math.trunc(roundedRatingNear0_5);
  const decimalPart = roundedRatingNear0_5 - fullStars;
  const halfStar = !!decimalPart ? 1 : 0;
  const emptyRate = 5 - fullStars - halfStar;

  const fullStarColor = "#d3ab0a";
  const emptyStarColor = "#ddd";

  return (
    <div>
      {[...Array(fullStars)].map((e, i) => (
        <DynamicIcons
          key={`fullstar_${i}`}
          color={fullStarColor}
          iconName="IoIosStar"
        />
      ))}
      {[...Array(halfStar)].map((e, i) => (
        <DynamicIcons
          key={`halfstar_${i}`}
          color={fullStarColor}
          iconName="IoIosStarHalf"
        />
      ))}
      {[...Array(emptyRate)].map((e, i) => (
        <DynamicIcons
          key={`emptystar_${i}`}
          color={emptyStarColor}
          iconName="IoIosStarOutline"
        />
      ))}
    </div>
  );
};
