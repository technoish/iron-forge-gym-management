import {
  GiMedal, GiHeartBeats, GiGymBag, GiMuscleUp, GiLotus, GiFire, GiWeightLiftingUp,
} from 'react-icons/gi'
import { FiBarChart2, FiHeart, FiClock, FiUser, FiMusic } from 'react-icons/fi'
import { MdOutlineFoodBank } from 'react-icons/md'


export const ICONS = {
  medal: GiMedal,
  chart: FiBarChart2,
  heart: FiHeart,
  clock: FiClock,
  dumbbell: GiWeightLiftingUp,
  heartbeat: GiHeartBeats,
  lotus: GiLotus,
  music: FiMusic,
  user: FiUser,
  fire: GiFire,
  apple: MdOutlineFoodBank,
  gym: GiGymBag,
  muscle: GiMuscleUp,
}

export default function Icon({ name, size = 22, className = '' }) {
  const Component = ICONS[name] || GiGymBag
  return <Component size={size} className={className} aria-hidden="true" />
}
