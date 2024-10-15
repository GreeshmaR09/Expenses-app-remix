import { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import MainHeader from "~/components/navigation/MainHeader";
import markettingStyles from "~/styles/marketing.css?url";
import { getUserFromSession } from "~/utils/auth.server";

export default function MarkettingLayout() {
  return (
    <>
      <MainHeader/> 
      <Outlet />
    </>
  );
}
export async function loader({request}:LoaderFunctionArgs){
  return getUserFromSession(request)
}
export function links() {
  return [{ rel: "stylesheet", href: markettingStyles }];
}
