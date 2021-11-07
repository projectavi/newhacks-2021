<script>
	import { onMount } from 'svelte';
    import Typewriter from "svelte-typewriter";

	let characters = ['🥳', '🎉', '✨'];

	let confetti = new Array(100).fill()
		.map((_, i) => {
			return {
				character: characters[i % characters.length],
				x: Math.random() * 100,
				y: -20 - Math.random() * 100,
				r: 0.1 + Math.random() * 1
			};
		})
		.sort((a, b) => a.r - b.r);

	onMount(() => {
		let frame;

		function loop() {
			frame = requestAnimationFrame(loop);

			confetti = confetti.map(emoji => {
				emoji.y += 0.7 * emoji.r;
				if (emoji.y > 120) emoji.y = -20;
				return emoji;
			});
		}

		loop();

		return () => cancelAnimationFrame(frame);
	});
</script>

<main>
    {#each confetti as c}
        <span style="left: {c.x}%; top: {c.y}%; transform: scale({c.r})">{c.character}</span>
    {/each}
    <div class="middle">
        <Typewriter interval={100} scrambleSlowdown=true >
            <h1>Dialog: Get Started</h1>
        </Typewriter>
    </div>
</main>

<style>
	:global(body) {
		overflow: hidden;
	}

    .middle {
        margin: auto;
        background-color: transparent;
    }

    main {
        height: 100%;
        width: 100%;
        display: grid;
        background-color: #ffaa00;
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:svgjs='http://svgjs.com/svgjs' width='1440' height='560' preserveAspectRatio='none' viewBox='0 0 1440 560'%3e%3cg mask='url(%26quot%3b%23SvgjsMask1011%26quot%3b)' fill='none'%3e%3crect width='1440' height='560' x='0' y='0' fill='rgba(255%2c 170%2c 0%2c 1)'%3e%3c/rect%3e%3cpath d='M720 705.78C831.32 710.98 931.48 649 1012.98 572.98 1097.94 493.69 1175.67 396.21 1176.28 280 1176.89 163.35 1102.02 62.81 1016.07-16.07 934.23-91.18 831.04-141.53 720-138.85 611.4-136.19 510.93-82.51 437.97-2.03 368.47 74.57 337.3 176.61 340.15 280 342.94 380.37 386.36 471.86 453.2 546.8 524.84 627.11 612.49 700.75 720 705.78' fill='rgba(255%2c 197%2c 0%2c 1)'%3e%3c/path%3e%3cpath d='M720 555.51C792.03 558.87 856.84 518.77 909.57 469.57 964.55 418.27 1014.84 355.2 1015.24 280 1015.64 204.52 967.19 139.46 911.58 88.42 858.62 39.83 791.85 7.24 720 8.98 649.73 10.7 584.72 45.44 537.51 97.51 492.54 147.08 472.37 213.1 474.22 280 476.02 344.94 504.11 404.15 547.37 452.63 593.72 504.6 650.44 552.25 720 555.51' fill='rgba(255%2c 229%2c 41%2c 1)'%3e%3c/path%3e%3cpath d='M720 405.23C752.74 406.76 782.2 388.53 806.17 366.17 831.16 342.85 854.02 314.18 854.2 280 854.38 245.69 832.36 216.12 807.08 192.92 783.01 170.83 752.66 156.02 720 156.81 688.06 157.59 658.51 173.38 637.05 197.05 616.61 219.58 607.44 249.59 608.28 280 609.1 309.52 621.87 336.43 641.53 358.47 662.6 382.09 688.38 403.75 720 405.23' fill='rgba(255%2c 255%2c 102%2c 1)'%3e%3c/path%3e%3c/g%3e%3cdefs%3e%3cmask id='SvgjsMask1011'%3e%3crect width='1440' height='560' fill='white'%3e%3c/rect%3e%3c/mask%3e%3c/defs%3e%3c/svg%3e");
        background-attachment: fixed;   
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
    }

	span {
		position: absolute;
		font-size: 5vw;
		user-select: none;
	}
</style>
