import { useReducer, memo, useCallback } from "react";
import "./index.css";

import FieldForm from "../../component/field-form";
import Grid from "../../component/grid";

import { Alert, Loader, LOAD_STATUS } from "../../component/load";

import {
  requestInitialState,
  requestReducer,
  REQUEST_ACTION_TYPE,
} from "../../util/request";

function Container({ onCreate, placeholder, button, id = null }) {
  const [state, dispatch] = useReducer(requestReducer, requestInitialState);
  // const [status, setStatus] = useState(null);
  // const [message, setMassage] = useState("");

  const convertData = useCallback(
    ({ value }) =>
      JSON.stringify({
        text: value,
        username: "user",
        postId: id,
      }),
    [id]
  );

  const sendData = useCallback(
    async (dataToSend) => {
      dispatch({ type: REQUEST_ACTION_TYPE.PROGRESS });
      //setStatus(LOAD_STATUS.PROGRESS);

      try {
        const res = await fetch("http://localhost:4000/post-create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: convertData(dataToSend),
        });

        const data = await res.json();

        if (res.ok) {
          dispatch({ type: REQUEST_ACTION_TYPE.RESET });
          //setStatus(null);

          if (onCreate) onCreate();
        } else {
          dispatch({ type: REQUEST_ACTION_TYPE.ERROR, message: data.message });
          // setMassage(data.message);
          // setStatus(LOAD_STATUS.ERROR);
        }
      } catch (error) {
        dispatch({ type: REQUEST_ACTION_TYPE.ERROR, message: error.message });
        //setMassage(error.message);
        //setStatus(LOAD_STATUS.ERROR);
      }
    },
    [convertData, onCreate]
  );

  const handleSubmit = useCallback(
    (value) => {
      return sendData({ value });
    },
    [sendData]
  );

  console.log("render");

  return (
    <Grid>
      <FieldForm
        placeholder={placeholder}
        button={button}
        onSubmit={handleSubmit}
      />
      {state.status === LOAD_STATUS.ERROR && (
        <Alert status={state.status} massage={state.message} />
      )}
      {state.status === LOAD_STATUS.PROGRESS && <Loader />}
    </Grid>
  );
}

export default memo(Container, (prev, next) => {
  console.log(prev, next);

  return true;
});