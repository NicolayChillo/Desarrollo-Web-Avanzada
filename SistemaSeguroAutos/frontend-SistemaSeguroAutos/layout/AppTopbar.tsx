import { forwardRef, useContext, useImperativeHandle, useRef } from 'react';
import { LayoutContext } from './context/layoutcontext';
import type { AppTopbarRef } from '@/types';
import Link from 'next/link';
import { Ripple } from 'primereact/ripple';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';
import authService from '../services/authService';

const AppTopbar = forwardRef<AppTopbarRef>((props, ref) => {
    const { onMenuToggle, onTopbarMenuToggle } = useContext(LayoutContext);
    const menubuttonRef = useRef(null);
    const mobileButtonRef = useRef(null);
    const router = useRouter();

    const onMenuButtonClick = () => {
        onMenuToggle();
    };

    const onMobileTopbarMenuButtonClick = () => {
        onTopbarMenuToggle();
    };

    const handleLogout = () => {
        authService.logout();
        router.push('/auth/login');
    };

    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current
    }));

    const usuario = authService.getCurrentUser();

    return (
        <div className="layout-topbar">
            <div className="layout-topbar-start">
                <Link className="layout-topbar-logo" href="/dashboards/sistema">
                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--topbar-item-text-color)' }}>
                        🚗 Sistema de Seguros
                    </span>
                </Link>
                <a ref={menubuttonRef} className="p-ripple layout-menu-button" onClick={onMenuButtonClick}>
                    <i className="pi pi-angle-right"></i>
                    <Ripple />
                </a>

                <a ref={mobileButtonRef} className="p-ripple layout-topbar-mobile-button" onClick={onMobileTopbarMenuButtonClick}>
                    <i className="pi pi-ellipsis-v"></i>
                    <Ripple />
                </a>
            </div>

            <div className="layout-topbar-end">
                <div className="layout-topbar-actions-end">
                    <ul className="layout-topbar-items">
                        <li className="px-3">
                            <span style={{ color: 'var(--topbar-item-text-color)' }}>
                                👤 {usuario?.nombreUsuario || 'Usuario'}
                            </span>
                        </li>
                        <li>
                            <Button 
                                label="Cerrar Sesión" 
                                icon="pi pi-sign-out" 
                                className="p-button-text p-button-plain"
                                onClick={handleLogout}
                            />
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
});

AppTopbar.displayName = 'AppTopbar';

export default AppTopbar;
