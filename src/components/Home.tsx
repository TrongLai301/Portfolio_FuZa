import { forwardRef } from "react";
const Home = forwardRef<HTMLDivElement>((props, ref) => {
    return (
        <section className="flex snap-start" id="home" style={{ height: "100vh" }} ref={ref}>
            <div className="w-2/5"></div>
            <div className="w-3/5"></div>
        </section>
    );
}
);

export default Home;