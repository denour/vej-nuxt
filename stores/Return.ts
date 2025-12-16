// stores/returns.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Condition, GuaranteeReason, ReturnStep } from "~~/models/Return"

export const useReturnsStore = defineStore('returns', () => {
    const guaranteeReasons = ref<GuaranteeReason[]>([
        { title: 'Planta enferma', description: 'Si tu planta llegó enferma, la reemplazamos.', icon: 'check-circle' },
        { title: 'Daño en transporte', description: 'Si hubo daño durante el envío, hacemos el reemplazo.', icon: 'check-circle' }
    ])

    const returnSteps = ref<ReturnStep[]>([
        { number: 1, title: 'Contacta al soporte', description: 'Envíanos fotos y datos de tu pedido', icon: 'RotateCcw' },
        { number: 2, title: 'Empaqueta tu planta', description: 'Usa el empaque original o uno similar', icon: 'CheckCircle' },
        { number: 3, title: 'Envío de retorno', description: 'Lleva tu planta a la paquetería', icon: 'Calendar' },
        { number: 4, title: 'Reembolso', description: 'Recibe tu dinero o reemplazo', icon: 'CheckCircle' }
    ])

    const conditions = ref<Condition[]>([
        'La planta debe estar en condiciones originales',
        'El producto no debe haber sido trasplantado',
        'El pedido debe estar dentro de los 30 días'
    ])

    return {
        guaranteeReasons,
        returnSteps,
        conditions
    }
})
