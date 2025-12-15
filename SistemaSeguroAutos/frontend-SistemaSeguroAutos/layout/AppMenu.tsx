import AppSubMenu from './AppSubMenu';
import type { MenuModel } from '@/types';

const AppMenu = () => {
    const model: MenuModel[] = [
        {
            label: 'Sistema de Seguros',
            icon: 'pi pi-home',
            items: [
                {
                    label: 'Dashboard',
                    icon: 'pi pi-fw pi-home',
                    to: '/dashboards/sistema'
                },
                {
                    label: 'Conductores',
                    icon: 'pi pi-fw pi-users',
                    to: '/conductores'
                },
                {
                    label: 'Vehículos',
                    icon: 'pi pi-fw pi-car',
                    to: '/vehiculos'
                },
                {
                    label: 'Cotizaciones',
                    icon: 'pi pi-fw pi-list',
                    items: [
                        {
                            label: 'Nueva Cotización',
                            icon: 'pi pi-fw pi-plus',
                            to: '/nueva-cotizacion'
                        },
                        {
                            label: 'Ver Cotizaciones',
                            icon: 'pi pi-fw pi-th-large',
                            to: '/cotizaciones'
                        }
                    ]
                }
            ]
        }
    ];

    return <AppSubMenu model={model} />;
};

export default AppMenu;