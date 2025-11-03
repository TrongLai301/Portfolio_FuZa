import { forwardRef } from "react";

const About = forwardRef<HTMLDivElement>((props, ref) => {
    return (
        <section className="snap-start" id="about" style={{ height: "100vh" }} ref={ref}> 
            <h1>About Page</h1>
        </section>
    );
});

export default About;