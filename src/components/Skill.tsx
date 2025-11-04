import { forwardRef } from "react";
const Skill = forwardRef<HTMLDivElement>((props, ref) => {
  return (
    <section className="snap-start" id="skills" style={{ height: "100vh" }} ref={ref}>
      <h1>Skill Page</h1>
    </section>
  );
});

export default Skill;