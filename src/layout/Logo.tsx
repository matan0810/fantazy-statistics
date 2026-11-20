import { Laurel, Trophy } from '../ui/Ornaments';

/** The site's mark: a small trophy inside a laurel wreath. */
export function Logo({ size = 40 }: { size?: number }) {
  return (
    <Laurel size={size}>
      <Trophy size={size * 0.42} />
    </Laurel>
  );
}
