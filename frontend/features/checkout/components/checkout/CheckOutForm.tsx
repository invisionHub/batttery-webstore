"use client"

import { CheckoutForm, OrderSummary, PaymentButton } from '@/components/checkOut'
import { CheckoutFormData } from '@/schemas/checkoutSchema'
import { FormProvider, UseFormReturn } from 'react-hook-form'

interface ICheckOutFormProps {
    deliveryMethod: "standard" | "express" | "pickup",
    paymentMethod: "card" | "bank_transfer" | "ussd",
    methods: UseFormReturn<CheckoutFormData>,
    isLoading: boolean,
    total: number,
    onSubmit:()=>void

}
export const CheckOutForm = ({ ...checkOutFormProps }: ICheckOutFormProps) => {
    const { deliveryMethod, isLoading, methods, onSubmit, paymentMethod, total } = checkOutFormProps
    
  return (
    <FormProvider {...methods}>
          <div
            className="grid grid-cols-1 lg:grid-cols-3"
            style={{ gap: '24px', alignItems: 'flex-start' }}
          >
            <div
              className="lg:col-span-2"
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              <CheckoutForm />
              <PaymentButton
                isLoading={isLoading}
                isDisabled={isLoading}
                total={total}
                paymentMethod={paymentMethod}
                onSubmit={onSubmit}
              />
            </div>
            <div>
              <OrderSummary deliveryMethod={deliveryMethod} />
            </div>
          </div>
    </FormProvider>
  )
}
