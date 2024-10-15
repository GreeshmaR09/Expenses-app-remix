import { Form, Link, useActionData, useNavigation, useSearchParams } from "@remix-run/react";
import { ReactNode } from "react";
import { FaLock, FaUserPlus } from "react-icons/fa";

function AuthForm() {
  const [searchParams] = useSearchParams();
  const navigation = useNavigation();
   const authMode = searchParams.get("mode") || "login";
  const submitBtnCaption = authMode === "login" ? "Login " : "Create user";
  const validationErrors = useActionData<{ [key: string]: string } | null>();
  const toggleBtnCaption =
    authMode === "login" ? "Create a new user " : "Login with existing user";
  const isSubmitting = navigation.state !== "idle";

  return (
    <Form method="post" className="form" id="auth-form">
      <div className="icon-img">
        {authMode === "login" ? <FaLock /> : <FaUserPlus />}
      </div>
      <p>
        <label htmlFor="email">Email Address</label>
        <input type="email" id="email" name="email" required />
      </p>
      <p>
        <label htmlFor="password">Password</label>
        <input type="password" id="password" name="password" minLength={7} />
      </p>
      {validationErrors && (
  <ul>
    {Object.values(validationErrors).map((error: ReactNode) => (
      <li key={error as string}>{error}</li>
    ))}
  </ul>
)}

      <div className="form-actions">
        <button disabled={isSubmitting}>
          {isSubmitting ? "Authenticating" : submitBtnCaption}
        </button>
        <Link to={authMode === "login" ? "?mode=signup" : "?mode=login"}>
          {toggleBtnCaption}
        </Link>
      </div>
    </Form>
  );
}

export default AuthForm;
