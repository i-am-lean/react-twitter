import {
    useState,
    useEffect,
    useReducer,
    Fragment,
    lazy,
    Suspense,
    useCallback,
  } from "react";
  
  import Title from "../../component/title";
  import Grid from "../../component/grid";
  import Box from "../../component/box";
  
  import PostCreate from "../post-create";
  import { Alert, LOAD_STATUS, Skeleton } from "../../component/load";
  import { getDate } from "../../util/getDate";
  
  //import PostItem from "../post-item";
  
  import {
    requestInitialState,
    requestReducer,
    REQUEST_ACTION_TYPE,
  } from "../../util/request";
  import { useWindowListeren } from "../../util/useWindowListeren";
  
  const PostItem = lazy(() => import("../post-item"));
  
  export default function Container() {
    const [state, dispatch] = useReducer(requestReducer, requestInitialState);
    // const [status, setStatus] = useState(null);
    // const [message, setMessage] = useState("");
    // const [data, setData] = useState(null);
  
    const getData = useCallback(async () => {
      dispatch({ type: REQUEST_ACTION_TYPE.PROGRESS });
      //setStatus(LOAD_STATUS.PROGRESS);
      try {
        const res = await fetch("http://localhost:4000/post-list");
  
        const data = await res.json();
  
        if (res.ok) {
          dispatch({
            type: REQUEST_ACTION_TYPE.SUCCESS,
            payload: convertData(data),
          });
          //setData(convertData(data));
          //setStatus(LOAD_STATUS.SUCCESS);
        } else {
          dispatch({
            type: REQUEST_ACTION_TYPE.ERROR,
            payload: data.message,
          });
          //setMessage(data.message);
          //setStatus(LOAD_STATUS.ERROR);
        }
      } catch (error) {
        dispatch({
          type: REQUEST_ACTION_TYPE.ERROR,
          payload: error.message,
        });
        //setMessage(error.message);
        //setStatus(LOAD_STATUS.ERROR);
      }
    }, []);
  
    const convertData = (raw) => ({
      list: raw.list.reverse().map(({ id, username, text, date }) => ({
        id,
        username,
        text,
        date: getDate(date),
      })),
  
      isEmpty: raw.list.length === 0,
    });
  
    useEffect(() => {
      getData();
  
      const intevalId = setInterval(() => getData(), 5000);
  
      return clearInterval(intevalId);
    }, []);
  
    // if (status === null) {
    //   getData();
    // }
  
    const [position, setPosition] = useState({ x: 0, y: 0 });
  
    useWindowListeren("pointermove", (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    });
  
    return (
      <Grid>
        <Box>
          <Grid>
            <Title>Home</Title>
            <PostCreate
              onCreate={getData}
              placeholder="What is happening?!"
              button="Post"
            />
          </Grid>
        </Box>
  
        {state.status === REQUEST_ACTION_TYPE.PROGRESS && (
          <Fragment>
            <Box>
              <Skeleton />
            </Box>
            <Box>
              <Skeleton />
            </Box>
          </Fragment>
        )}
  
        {state.status === REQUEST_ACTION_TYPE.ERROR && (
          <Alert status={state.status} message={state.message} />
        )}
  
        {state.status === REQUEST_ACTION_TYPE.SUCCESS && (
          <Fragment>
            {state.data.isEmpty ? (
              <Alert message="Список постів пустий" />
            ) : (
              state.data.list.map((item) => (
                <Fragment key={item.id}>
                  <Suspense
                    fallback={
                      <Box>
                        <Skeleton />
                      </Box>
                    }
                  >
                    <PostItem {...item} />
                  </Suspense>
  
                  {/* {item.username} - {item.date} */}
                </Fragment>
              ))
            )}
          </Fragment>
        )}
      </Grid>
    );
  }