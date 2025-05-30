// FUNCTION TOMBOL TAMBAH
function tambahProduk() {
    const template = document.getElementById("product-template").innerHTML;
    const wrapper = document.createElement("div");
    wrapper.innerHTML = template;
    document.getElementById("product-container").appendChild(wrapper);
}

//FUNCTION MENAMPILKAN CLONE SESUAI PILIHAN DROPDOWN 
function tambahProduk() {
    const container = document.querySelector("#product-container");
    const template = document.querySelector("#product-template");
    const clone = template.cloneNode(true);
    clone.classList.remove("d-none");

    // Dapatkan elemen dropdown jenis produk di dalam clone
    const dropdown = clone.querySelector(".jenis-produk");

    // Dapatkan semua opsi detail di dalam clone
    const opsiTshirt = clone.querySelector(".opsi-tshirt");
    const opsiTopi = clone.querySelector(".opsi-topi");
    const opsiMug = clone.querySelector(".opsi-mug");
    const opsiPlakat = clone.querySelector(".opsi-plakat");
    const opsiLanyard = clone.querySelector(".opsi-lanyard");
    const opsiBanner = clone.querySelector(".opsi-banner");
    // (tambahkan yang lain kalau perlu: topi, plakat, dll)

    // Event ketika memilih produk
    dropdown.addEventListener("change", function () {
        // Sembunyikan semua opsi dulu
        if (opsiTshirt) opsiTshirt.style.display = "none";
        if (opsiTopi) opsiTopi.style.display = "none";
        if (opsiMug) opsiMug.style.display = "none";
        if (opsiPlakat) opsiPlakat.style.display = "none";
        if (opsiLanyard) opsiLanyard.style.display = "none";
        if (opsiBanner) opsiBanner.style.display = "none";

        
        // Tampilkan sesuai pilihan
        if (this.value === "tshirt") {
            opsiTshirt.style.display = "block";
        } 
            else if (this.value === "topi") {
                    opsiTopi.style.display = "block";
        } 
            else if (this.value === "mug") {
                    opsiMug.style.display = "block";
        }
            else if (this.value === "plakat") {
                    opsiPlakat.style.display = "block";
        }
            else if (this.value === "lanyard") {
                    opsiLanyard.style.display = "block";
        }
            else if (this.value === "banner") {
                    opsiBanner.style.display = "block";
        }
        
        // Tambah else if sesuai jenis lain
    });

    // Masukkan elemen clone ke dalam container
    container.appendChild(clone);
}


// TOMBOL CEK TOTAL HARGA
document.getElementById("button_total_harga").addEventListener("click", function () {
    let totalKeseluruhan = 0;
    const produkAktif = document.querySelectorAll("#product-container > div:not(.d-none)");

    let isValid = true;

    produkAktif.forEach(formProduk => {
        const jenis = formProduk.querySelector(".jenis-produk")?.value;

        if (jenis === "tshirt") {
            const hargaJenis = parseInt(formProduk.querySelector(".jenis_tshirt")?.value || 0);
            const hargaModel = parseInt(formProduk.querySelector(".model_tshirt")?.value || 0);
            const hargaUkuran = parseInt(formProduk.querySelector(".ukuran_tshirt")?.value || 0);
            const jumlah = parseInt(formProduk.querySelector(".jumlah_tshirt")?.value || 0);

            if (
                isNaN(hargaJenis) ||
                isNaN(hargaModel) ||
                isNaN(hargaUkuran) ||
                isNaN(jumlah) ||
                jumlah < 1
            ) {
                isValid = false;
                return;
            }

            const subtotal = (hargaJenis + hargaModel + hargaUkuran) * jumlah;
            totalKeseluruhan += subtotal;
        }

        // else if (jenis === "mug") { ... } bisa ditambahkan nanti
    });

    if (!isValid) {
        document.getElementById("total_harga").textContent = "Isi data dengan benar";
        return;
    }

    document.getElementById("total_harga").textContent = `Rp${totalKeseluruhan.toLocaleString('id-ID')}`;
});

// FORMULIR PEMBAYARAN
document.addEventListener('DOMContentLoaded', function() {
    const pembayaranSelect = document.querySelector('.jenis-pembayaran');
    const boxPembayaran = document.querySelectorAll('.box-pembayaran');
    const buktiPembayaran = document.getElementById('container-bukti-pembayaran');

    pembayaranSelect.addEventListener('change', function() {
        boxPembayaran.forEach(box => box.classList.add('d-none'));
        buktiPembayaran.classList.add('d-none');
        if (this.value === 'bankbri') {
            document.querySelector('.pembayaran-bri').classList.remove('d-none');
            buktiPembayaran.classList.remove('d-none');
        } else if (this.value === 'gopay') {
            document.querySelector('.pembayaran-gopay').classList.remove('d-none');
            buktiPembayaran.classList.remove('d-none');
        } else if (this.value === 'qris') {
            document.querySelector('.pembayaran-qris').classList.remove('d-none');
            buktiPembayaran.classList.remove('d-none');
        } else if (this.value === 'dana') {
            document.querySelector('.pembayaran-dana').classList.remove('d-none');
            buktiPembayaran.classList.remove('d-none');
        }
    });
});

// NOTIFIKASI
function showNotif2XCD(msg, type = "success", timeout = 3000) {
    const notif = document.getElementById("notif-2xcd");
    notif.textContent = msg;
    notif.className = "alert " + type;
    notif.style.display = "block";
    notif.style.opacity = "0.95";
    setTimeout(() => {
        notif.style.opacity = "0";
        setTimeout(() => notif.style.display = "none", 400);
    }, timeout);
}


// PENGIRIMAN DATA FORM KE AIRTABLE

// CLOUDINARY
const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dotdeufaw/image/upload';
const CLOUDINARY_UPLOAD_PRESET = 'bukti_pembayaran_2xcd';

document.getElementById("formulir_pemesanan").addEventListener("submit", async function(e) {
    e.preventDefault();

    // Disable input pada produk yang tidak aktif
    document.querySelectorAll("#product-container > div").forEach(div => {
        if (div.style.display === "none" || div.classList.contains("d-none")) {
            div.querySelectorAll("input, select, textarea").forEach(input => {
                input.disabled = true;
            });
        } else {
            // Hanya aktifkan input di opsi yang tampil
            div.querySelectorAll(".opsi-tshirt, .opsi-topi, .opsi-mug, .opsi-plakat, .opsi-lanyard, .opsi-banner").forEach(opsi => {
                if (opsi.style.display === "none") {
                    opsi.querySelectorAll("input, select, textarea").forEach(input => {
                        input.disabled = true;
                    });
                } else {
                    opsi.querySelectorAll("input, select, textarea").forEach(input => {
                        input.disabled = false;
                    });
                }
            });
        }
    });

    // Validasi produk minimal 1
    const produkAktif = document.querySelectorAll("#product-container > div:not(.d-none)");
    if (produkAktif.length === 0) {
        alert("Pilih minimal satu produk!");
        return;
    }

    // Validasi pembayaran
    const pembayaranSelect = document.querySelector('.jenis-pembayaran');
    if (!pembayaranSelect.value || pembayaranSelect.value === "Pilih Metode Pembayaran") {
        alert("Pilih metode pembayaran!");
        return;
    }

    // Validasi bukti pembayaran
    const buktiInput = document.getElementById("bukti_pembayaran");
    if (!buktiInput.files || buktiInput.files.length === 0) {
        alert("Upload bukti pembayaran!");
        return;
    }

    // Upload gambar ke Cloudinary
    const file = buktiInput.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    let buktiUrl = "";
    try {
        const res = await fetch(CLOUDINARY_URL, {
            method: "POST",
            body: formData
        });
        const data = await res.json();
        if (data.secure_url) {
            buktiUrl = data.secure_url;
        } else {
            alert("Gagal upload bukti pembayaran!");
            return;
        }
    } catch (err) {
        alert("Gagal upload bukti pembayaran!");
        return;
    }

    // Ambil data produk
    let produkData = {
        TShirt: "",
        Topi: "",
        Mug: "",
        Plakat: "",
        Lanyard: "",
        Banner: ""
    };
    produkAktif.forEach(formProduk => {
        const jenis = formProduk.querySelector(".jenis-produk")?.value;
        if (jenis === "tshirt") {
            const jenisTshirt = formProduk.querySelector(".jenis_tshirt")?.selectedOptions[0]?.text || "";
            const modelTshirt = formProduk.querySelector(".model_tshirt")?.selectedOptions[0]?.text || "";
            const ukuran = formProduk.querySelector(".ukuran_tshirt")?.selectedOptions[0]?.text || "";
            const warna = formProduk.querySelector(".warna_tshirt")?.selectedOptions[0]?.text || "";
            const modelDesign = formProduk.querySelector(".model_design_tshirt")?.selectedOptions[0]?.text || "";
            const jumlah = formProduk.querySelector(".jumlah_tshirt")?.value || "";
            produkData.TShirt = `Jenis: ${jenisTshirt}, Model: ${modelTshirt}, Ukuran: ${ukuran}, Warna: ${warna}, ModelDesign: ${modelDesign}, Jumlah: ${jumlah}`;
        }
        if (jenis === "topi") {
            produkData.Topi = "Isi detail topi di sini";
        }
        // Tambahkan else if untuk produk lain sesuai kebutuhan
    });

    // Ambil data dari form
    const dataAirtable = {
        fields: {
            "NamaDepan": document.getElementById("nama_pemesan_depan").value,
            "NamaBelakang": document.getElementById("nama_pemesan_belakang").value,
            "Email": document.getElementById("email_pemesan").value,
            "Nomor": document.getElementById("nomor_pemesan").value,
            "Alamat": document.getElementById("alamat_pemesan").value,
            "Kodepos": document.getElementById("kodepos_pemesan").value,
            "Tanggal": document.getElementById("tanggal_pemesan").value,
            "TShirt": produkData.TShirt,
            "Topi": produkData.Topi,
            "Mug": produkData.Mug,
            "Plakat": produkData.Plakat,
            "Lanyard": produkData.Lanyard,
            "Banner": produkData.Banner,
            "MetodePembayaran": pembayaranSelect.options[pembayaranSelect.selectedIndex].text,
            "BuktiPembayaran": buktiUrl
        }
    };

    // Kirim ke server middle (proxy)
    fetch("https://bird-mellow-candle.glitch.me", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dataAirtable)
    })
    .then(async res => {
        const text = await res.text();
        try {
            return JSON.parse(text);
        } catch {
            return text;
        }
    })
    .then(response => {
        if (typeof response === "object" && response !== null && response.error) {
            showNotif2XCD("Gagal mengirim data: " + response.error, "error");
            console.error(response);
        } else {
            showNotif2XCD("Data berhasil dikirim!", "success");
            document.getElementById("formulir_pemesanan").reset();
            document.querySelectorAll('.box-pembayaran').forEach(box => box.classList.add('d-none'));
            document.getElementById('container-bukti-pembayaran').classList.add('d-none');
        }
    })
    .catch(err => {
        showNotif2XCD("Gagal mengirim data (server tidak bisa dihubungi)!", "error");
        console.error(err);
    });
})
