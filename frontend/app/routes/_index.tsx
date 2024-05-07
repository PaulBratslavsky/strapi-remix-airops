import { Link, Outlet } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { ChatIcon } from "~/components/icons/ChatIcon";

export default function IndexRoute() {
  return (
    <div>
      <h1>Index</h1>
      <p>Welcome to the Index page!</p>
      <Link to="/chat">
          <Button className="absolute right-20 top-4 bg-violet-600 hover:bg-violet-500">
            <ChatIcon className="w-4 h-4" />
          </Button>
          <Outlet />
        </Link>
    </div>
  )
}
