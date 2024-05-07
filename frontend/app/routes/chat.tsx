import { Modal } from "~/components/custom/Modal";
import { useFetcher } from "@remix-run/react";
import { type ActionFunctionArgs, json } from "@remix-run/node";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { chat } from "~/services/chat";
import { useEffect, useState, useRef } from "react";

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const formItems = Object.fromEntries(formData);
  const videoId = params.videoId;

  let response: any = null;

  if (formItems._action === "chat") {
    try {
      response = await chat(videoId as string, formItems.query as string);
      console.log(response);
      return json({
        data: {
          response: response.response,
          sessionId: response.session_id,
        },
        message: "Updated!",
        error: null,
      });
    } catch (error) {
      return json({ data: null, message: "Error!", error }, 500);
    }
  }
}

export default function ChatRoute() {
  const [text, setText] = useState("");
  const fetcher = useFetcher<typeof action>();
  const isSubmitting = fetcher.formData?.get("_action") === "chat";
  const isSaving = fetcher.formData?.get("_action") === "bookmark";

  const data = fetcher.data;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  interface ActionData {
    data: {
      data: {
        response: string;
        sessionId: string;
      };
      message: string;
    };
  }

  useEffect(() => {
    console.log(data);
    if (data) {
      setText((prevState) => prevState.concat("\n \n" + data.data?.response ));
      // Scroll the textarea to the bottom every time the text changes

      // why you are not working
      if (textareaRef.current) {
        textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
      }
    }
  }, [data]);

  return (
    <div>
      <Modal>
        {text && (
          <fetcher.Form method="POST" className="w-full">
            <fieldset
              disabled={isSubmitting || isSaving}
              className="flex-row gap-2 items-center justify-center my-4 relative"
            >
              <Textarea
                name="content"
                className="w-full h-[400px] mt-4"
                value={text}
                ref={textareaRef}
              />
            </fieldset>
          </fetcher.Form>
        )}
        <fetcher.Form key={data?.data} method="POST" className="w-full">
          <fieldset
            disabled={isSubmitting || isSaving}
            className="flex gap-2 items-center justify-center my-4"
          >
            <Input
              name="query"
              placeholder="Ask your question"
              className="w-full"
              required
            />
            <Button name="_action" value="chat" type="submit">
              {isSubmitting ? "Sending..." : "Send"}
            </Button>
          </fieldset>
        </fetcher.Form>
      </Modal>
    </div>
  );
}
