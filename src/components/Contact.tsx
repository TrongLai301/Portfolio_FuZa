import { forwardRef } from "react";

const Contact = forwardRef<HTMLDivElement>((props, ref) => {
    return (
        <section className="snap-start" id="contact" style={{ height: "100vh" }} ref={ref}>
            <h1>Contact Page</h1>
        </section>
    );
});

export default Contact;
