import { Suspense } from "react";
import PaymentReturn from "./PaymentReturn";
const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentReturn />
    </Suspense>
  );
};

export default Page;
