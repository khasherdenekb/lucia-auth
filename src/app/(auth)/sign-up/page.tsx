import SignUpForm from "@/components/shared/SignUpForm";
import { validateRequest } from "@/lib/auth";
import { Clover } from "lucide-react";
import { redirect } from "next/navigation";

const SignUp = async () => {
  const { user } = await validateRequest();

  if (user) redirect("/");
  return (
    <div className="flex h-screen w-full justify-center items-center flex-col">
      <div className="flex gap-1 items-center pb-2">
        <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
          LUCIA
        </h2>
        <Clover className="w-7 h-7" />
      </div>
      <div className="flex flex-col gap-3 shadow-md p-5 rounded-lg w-96">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Create a free account
        </h3>
        <SignUpForm />
      </div>
    </div>
  );
};

export default SignUp;
