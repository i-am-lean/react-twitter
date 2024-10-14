import "./index.css";

export const LOAD_STATUS = {
    PROGRESS: "progress",
    SUCCESS: "success",
    ERROR: "error",
};

export function Alert ({ message, status = "default" }) {
    return <div className={`alert alert--${status}`}>{message}</div>;
}

export function Loader() { //анімована лінія коли браузер оновлює данні
    return <div className="loader"></div>;
}

export function Skeleton() { //блоки, що відповідають за контент сайту/сторінки (анімовані карточки постів, що завантажуються)
    return (
        <div className="skeleton">
            <div className="skeleton__item"></div>
            <div className="skeleton__item"></div>
            <div className="skeleton__item"></div>
        </div>

    );
}