
'use client';

import { useForm} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  checkoutSchema,
  checkoutDefaultValues,
  type CheckoutFormData,
} from '@/schemas/checkoutSchema';
import { deliveryDetails } from '../bussiness/delivery-details';
import { useCheckOut } from '../hook/useCheckOut';
import { deliveryConfig } from '../constants';
import {colors} from "../../../constants/theme"
import { EmprtCart } from '../components/checkout/EmprtCart';
import { StepIndicator } from '../components/checkout/StepIndicator';
import { FormErrorFormat } from '../components/checkout/FormErrorFormat';
import { CheckOutForm } from '../components/checkout/CheckOutForm';
import { CheckOutLayout } from '../components/checkout/CheckOutLayout';


//

export default function CheckoutView () {
   const { isLoading, items, router, subtotal} = useCheckOut()
  const {steps} = deliveryConfig

  const methods = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: checkoutDefaultValues,
    mode: 'onBlur',
  });

  const deliveryMethod = methods.watch('deliveryMethod');
  const paymentMethod = methods.watch('paymentMethod');
  // BUSSINESS LOGIC

  const total = deliveryDetails(deliveryMethod, subtotal);

  // VIEW PAGE
  const onSubmit = methods.handleSubmit(() => {
     console.log("hello")
  });

  // CART EMPTY COMPONENTS
  if (items.length === 0) {
    return <EmprtCart />
  }

  return (
    <CheckOutLayout>
      <StepIndicator steps={steps} /> 
      <FormErrorFormat errors={methods.formState.errors} />
      <CheckOutForm
        deliveryMethod={ deliveryMethod }
        paymentMethod={ paymentMethod }
        isLoading={ isLoading }
        methods={ methods }
        onSubmit={ onSubmit }
        total={ total }
      />
    </CheckOutLayout>
  );
}
