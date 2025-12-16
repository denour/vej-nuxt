// stores/shipment.ts
import { defineStore } from 'pinia'
import type {QuickCard, ShippingZone} from "~~/models/Shipment";

export const useShipmentInfo = defineStore('info', {
    state: () => ({
        quickCards: [
            {
                icon: 'Truck',
                title: 'Envío Gratis',
                description: 'En compras mayores a $1,000 MXN en CDMX y área metropolitana',
                bg: 'bg-green-100',
                iconColor: 'text-green-600 w-6 h-6'
            },
            {
                icon: 'Shield',
                title: 'Garantía de Llegada',
                description: 'Si tu planta llega dañada, te la reemplazamos sin costo adicional',
                bg: 'bg-blue-100',
                iconColor: 'text-blue-600 w-6 h-6'
            },
            {
                icon: 'Package',
                title: 'Empaque Especial',
                description: 'Sistema de protección diseñado específicamente para plantas vivas',
                bg: 'bg-purple-100',
                iconColor: 'text-purple-600 w-6 h-6'
            }
        ] as QuickCard[],

        shippingZones: [
            { zone: 'CDMX', time: '2-3 días', cost: '$150 MXN', regularCost: '$200 MXN' },
            { zone: 'Guadalajara', time: '3-4 días', cost: '$200 MXN', regularCost: '$250 MXN' },
            { zone: 'Monterrey', time: '3-5 días', cost: '$220 MXN', regularCost: '$270 MXN' }
        ] as ShippingZone[]
    }),

    getters: {
        getQuickCards: state => state.quickCards,
        getShippingZones: state => state.shippingZones
    }
})
