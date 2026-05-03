const v = document.getElementById('iptv');
    const vLogo = document.getElementById('v_logo');
    const h = new Hls();
    let logoTimer;

    // Fungsi untuk menampilkan logo dan mengatur timer sembunyi otomatis
    function showLogo() {
        if (vLogo.innerText !== "") {
            vLogo.style.opacity = "1";
            
            // Bersihkan timer sebelumnya jika ada
            clearTimeout(logoTimer);
            
            // Set timer untuk menghilangkan logo setelah 3 detik (3000ms)
            logoTimer = setTimeout(() => {
                vLogo.style.opacity = "0";
            }, 3000);
        }
    }

    function play(url, name) {
        if (name) {
            vLogo.innerText = name;
            showLogo(); // Panggil fungsi tampilkan saat channel baru dipilih
        }

        if (Hls.isSupported()) {
            h.loadSource(url);
            h.attachMedia(v);
            h.on(Hls.Events.MANIFEST_PARSED, () => v.play());
        } else {
            v.src = url;
            v.play();
        }
    }

    document.getElementById('m3u_file').onchange = (e) => {
        const reader = new FileReader();
        reader.onload = (ev) => {
            const lines = ev.target.result.split('\n');
            const list = document.getElementById('ch_list');
            list.innerHTML = '';
            let name = '';
            lines.forEach(l => {
                if (l.includes('#EXTINF:')) name = l.split(',').pop().trim();
                else if (l.startsWith('http')) {
                    const d = document.createElement('div');
                    d.className = 'ch-item';
                    d.innerText = name || 'Channel';
                    const link = l.trim();
                    const currentName = d.innerText;
                    d.onclick = () => play(link, currentName);
                    list.appendChild(d);
                }
            });
        };
        reader.readAsText(e.target.files[0]);
    };

    // Tambahan: tampilkan logo jika video di-klik atau layar di-tap (mobile)
    document.getElementById('player_box').addEventListener('click', showLogo);
    