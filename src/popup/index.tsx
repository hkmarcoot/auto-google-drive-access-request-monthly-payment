import { useEffect, useState } from "react";
import useSWR from "swr";

import { useStorage } from "@plasmohq/storage/hook";

import { callAPI } from "~core/premium-api";
import { UserInfoProvider, useUserInfo } from "~core/user-info";

import "../style.css";

const PremiumFeatureButton = ({
  setIsPaidMember,
}: {
  setIsPaidMember: (isPaidMember: boolean) => void;
}) => {
  const { data, error, isLoading } = useSWR<{ active: boolean }>(
    "/api/check-subscription",
    (uri: string) => callAPI(uri, { method: "GET" })
  );
  const userInfo = useUserInfo();

  console.log("data", data);

  useEffect(() => {
    if (!!error || !data?.active) {
      setIsPaidMember(false);
    } else {
      setIsPaidMember(true);
    }
  }, [error, data]);

  // if (isLoading) {
  //   return (
  //     <div className="flex flex-col justify-center items-center mt-8">
  //       <p>Loading...</p>
  //     </div>
  //   );
  // }

  if (!!error || !data?.active) {
    return (
      <div className="flex justify-center mt-10">
        <button
          disabled={!userInfo}
          onClick={async () => {
            chrome.identity.getAuthToken(
              {
                interactive: true,
              },
              (token) => {
                if (!!token) {
                  window.open(
                    `${
                      process.env.PLASMO_PUBLIC_STRIPE_LINK
                    }?client_reference_id=${
                      userInfo.id
                    }&prefilled_email=${encodeURIComponent(userInfo.email.toLowerCase())}`,
                    "_blank"
                  );
                }
              }
            );
          }}
          className="bg-green-300 px-2 py-1 text-sm border-green-100 border shadow-md rounded-md shadow-green-400 hover:bg-green-400 hover:text-white active:bg-green-500 active:text-white"
        >
          Become a Premium Member
        </button>
      </div>
    );
  }

  return (
    // <button
    //   onClick={async () => {
    //     const data = await callAPI("/api/premium-feature", {
    //       method: "POST"
    //     })

    //     alert(data.code)
    //   }}>
    //   Calling Awesome Premium Feature
    // </button>
    <div className="flex flex-col text-center mt-6">
      <p>Thank you for becoming a Premium Member!</p>
      <div className="flex justify-center">
        <button
          onClick={() => {
            window.open(
              `${process.env.PLASMO_PUBLIC_STRIPE_CUSTOMER_PORTAL}?prefilled_email=${encodeURIComponent(userInfo.email.toLowerCase())}`,
              "_blank"
            );
          }}
          className="mt-2 bg-green-300 px-2 py-1 text-sm border-green-100 border shadow-md rounded-md shadow-green-400 hover:bg-green-400 hover:text-white active:bg-green-500 active:text-white"
        >
          Get Your Receipt
        </button>
      </div>
    </div>
  );
};

const EmailShowcase = () => {
  const userInfo = useUserInfo();

  return (
    <div>
      Your email is: <b>{userInfo?.email}</b>
    </div>
  );
};

function IndexPopup() {
  const [isPaidMember, setIsPaidMember] = useState(false);
  const [insertMessage, setInsertMessage] = useStorage("insert-message", (v) =>
    v === undefined ? "Hey, I would like to access this document." : v
  );
  const [textareaValue, setTextareaValue] = useState(insertMessage);
  const [insertRadioChoice, setInsertRadioChoice] = useStorage(
    "insert-radio-choice",
    (v) => (v === undefined ? "0" : v)
  );
  const [isAllowAutoClickAndSubmit, setIsAllowAutoClickAndSubmit] = useStorage(
    "is-allow-auto-click-and-submit",
    (v) => (v === undefined ? true : v)
  );

  useEffect(() => {
    if (insertMessage !== undefined) {
      setTextareaValue(insertMessage);
    }
  }, [insertMessage]);

  return (
    <UserInfoProvider>
      <div className="h-128 w-80">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: 16,
          }}
        >
          <div>
            <h1 className="mb-2 text-sm font-bold text-green-700 text-center">
              Auto Google Drive Access Request Tool
            </h1>
            <EmailShowcase />
            <p>
              The extension is now auto-filling the Google Docs access request
              form.
            </p>

            <div className="mt-4 p-4 border border-gray-300 rounded-md shadow-md">
              <p className="mt-2">Role Selection:</p>
              <div className="flex justify-center mt-2">
                <div className="flex">
                  <div className="inline-flex items-center">
                    <input
                      type="radio"
                      value="0"
                      name="role"
                      checked={insertRadioChoice === "0"}
                      onChange={(e) => setInsertRadioChoice(e.target.value)}
                      className="cursor-pointer"
                      id="viewer"
                    />
                    <label
                      className="ml-1 text-sm text-slate-800 cursor-pointer"
                      htmlFor="viewer"
                    >
                      Viewer
                    </label>
                  </div>
                  <div className="inline-flex items-center ml-3">
                    <input
                      type="radio"
                      value="1"
                      name="role"
                      checked={insertRadioChoice === "1"}
                      onChange={(e) => setInsertRadioChoice(e.target.value)}
                      className="cursor-pointer"
                      id="commenter"
                    />
                    <label
                      className="ml-1 text-sm text-slate-800 cursor-pointer"
                      htmlFor="commenter"
                    >
                      Commenter
                    </label>
                  </div>
                  <div className="inline-flex items-center ml-3">
                    <input
                      type="radio"
                      value="2"
                      name="role"
                      checked={insertRadioChoice === "2"}
                      onChange={(e) => setInsertRadioChoice(e.target.value)}
                      className="cursor-pointer"
                      id="editor"
                    />
                    <label
                      className="ml-1 text-sm text-slate-800 cursor-pointer"
                      htmlFor="editor"
                    >
                      Editor
                    </label>
                  </div>
                </div>
              </div>
              <p className={"mt-6 " + (!isPaidMember ? "text-gray-400" : "")}>
                Message:
              </p>
              <div className="flex flex-col">
                <textarea
                  onChange={(e) => setTextareaValue(e.target.value)}
                  value={textareaValue}
                  disabled={!isPaidMember}
                  className="mt-2 mb-2 px-1 py-1 text-sm border border-gray-300 rounded-sm focus:rounded-sm disabled:opacity-50"
                />
                <button
                  onClick={() => setInsertMessage(textareaValue)}
                  disabled={!isPaidMember}
                  className="bg-green-300 px-2 py-1 text-sm border-green-100 border shadow-md rounded-md shadow-green-400 hover:bg-green-400 hover:text-white active:bg-green-500 active:text-white disabled:opacity-50 disabled:pointer-events-none"
                >
                  Save Message
                </button>
              </div>
              <div className="pt-6 flex justify-start items-center gap-2">
                <label
                  className={
                    "mt-2 " +
                    (!isPaidMember ? "text-gray-400 pointer-events-none" : "")
                  }
                >
                  Auto click and submit:
                </label>
                <div className="mt-3">
                  <input
                    type="checkbox"
                    checked={isAllowAutoClickAndSubmit}
                    onChange={(e) =>
                      setIsAllowAutoClickAndSubmit(!isAllowAutoClickAndSubmit)
                    }
                    disabled={!isPaidMember}
                    className={
                      "cursor-pointer " +
                      (!isPaidMember ? "pointer-events-none" : "")
                    }
                  />
                </div>
              </div>
            </div>

            <PremiumFeatureButton setIsPaidMember={setIsPaidMember} />
          </div>
        </div>
      </div>
    </UserInfoProvider>
  );
}

export default IndexPopup;
