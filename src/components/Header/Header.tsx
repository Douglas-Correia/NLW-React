import nlwUniteIcon from '../../assets/nlw-unite-icon.svg';
import { NavLink } from '../NavLink/NavLink';

export function Header() {
    return (
        <div className='flex items-center gap-5 py-2'>
            <div className='bg-orange-400 rounded h-9 w-11'>
                <img src={nlwUniteIcon} alt="Icon NLW Unite" width={60} height={60} />
            </div>

            <nav className='flex items-center gap-5'>
                <NavLink href='/eventos'>Eventos</NavLink>
                <NavLink href='/participantes'>Participantes</NavLink>
            </nav>
        </div>
    )
}