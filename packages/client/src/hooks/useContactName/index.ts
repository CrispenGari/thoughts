import { decompressJSON } from "@crispengari/utils";
import { TContact, UserType } from "@thoughts/api/src/types";
import React from "react";
import { useContactsStore } from "../../store";
export const useContactName = ({
  user,
}: {
  user: UserType | null | undefined;
}) => {
  const { contacts } = useContactsStore();
  const [contactName, setContactName] = React.useState(user?.name || "");
  const allNumbers = decompressJSON<TContact[]>(contacts).map(
    ({ phoneNumbers, contactName }) => ({
      contactName,
      phoneNumbers:
        typeof phoneNumbers === "undefined"
          ? []
          : phoneNumbers
              .map((p) =>
                p.phoneNumber.startsWith("+") ? p.phoneNumber : null
              )
              .filter(Boolean),
    })
  );
  React.useEffect(() => {
    if (!!user) {
      const name = allNumbers.find(
        (num) => num.phoneNumbers.indexOf(user.phoneNumber) !== -1
      )?.contactName;
      setContactName(name ? name : user.name);
    }
  }, [user]);

  return {
    contactName,
  };
};
