<h1 align="center">Saksham Ojha</h1>
<p align="center">
  Portfolio of a full-stack and applied AI developer at IIT Roorkee.
</p>
<p align="center">
  <a href="https://skx56.github.io/"><strong>skx56.github.io</strong></a>
</p>

The site is the public record: work, projects, and a way to get in touch. Two of the projects are interactive and live next to this repo, not inside it.

| Project | What it is | Demo |
| --- | --- | --- |
| [Echo](https://github.com/skx56/Echo) | Duplex voice agent. Barge-in cancels the in-flight turn, including tools and speech. | [skx56.github.io/Echo](https://skx56.github.io/Echo/) |
| [Grain](https://github.com/skx56/Grain) | SQL agent that locks the metric, the join, and the grain before it returns a number. | [skx56.github.io/Grain](https://skx56.github.io/Grain/) |

Grain also has a copy you can open from this site at [/grain](https://skx56.github.io/grain/). Echo lives only in its own repository.

## On the page

- **About** — IIT Roorkee, B.Tech, Aug 2023 – May 2027
- **Experience and leadership**
- **Projects** — Echo, Grain, Together, wShare, and the rest, each with a repository or a live demo
- **Skills and contact** — [sakshamojha96@gmail.com](mailto:sakshamojha96@gmail.com)

## Stack

Next.js static export, TypeScript, Tailwind CSS, Framer Motion. Grain’s in-site demo runs SQLite compiled to WebAssembly. There is no server and no API key in this repository.

## Run it locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # static export in out/
```

Pushing `master` runs `.github/workflows/deploy.yml` and publishes `out/` to [skx56.github.io](https://skx56.github.io/).

## Edit

- Resume: `public/SakshamOjha_Resume.pdf`
- Sections: `components/*Section.tsx`, `components/ProfileCard.tsx`, `components/HeroPaint.tsx`
