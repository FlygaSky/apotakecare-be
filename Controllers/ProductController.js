const db = require('../Connection/Connection');
const util = require('util');
const query = util.promisify(db.query).bind(db);
const transporter = require('../Helpers/Transporter');
const { uploader } = require('../Helpers/Uploader');
var fs = require('fs');

module.exports = {
  getTotalProductsNum: (req, res) => {
    const category = req.query.category;
    let keluhan = req.query.keluhan;
    let hargaMin = req.query.hargamin;
    let hargaMax = req.query.hargamax;
    let jenisObat = req.query.jenisobat;
    let golonganObat = req.query.golonganobat;
    let search = req.query.search;

    var query1 = `SELECT COUNT(*) as countProducts FROM produk `;

    if (category == 'obat-obatan') {
      query1 += `WHERE KategoriObat_id = 1 `;
    }
    if (category == 'nutrisi') {
      query1 += `WHERE KategoriObat_id = 2 `;
    }
    if (category == 'herbal') {
      query1 += `WHERE KategoriObat_id = 3 `;
    }
    if (category == 'vitamin-suplemen') {
      query1 += `WHERE KategoriObat_id = 4 `;
    }
    if (category == 'alat-kesehatan') {
      query1 += `WHERE KategoriObat_id = 5 `;
    }
    if (category == 'perawatan-tubuh') {
      query1 += `WHERE KategoriObat_id = 6 `;
    }
    if (category == 'ibu-anak') {
      query1 += `WHERE KategoriObat_id = 7 `;
    }

        if(keluhan){
            if ((category !== ('semua-kategori' || '')) || search){
                query1 += `AND `
            }
            keluhanString = keluhan.split('-').join(',')
            query1 += `keluhan_id IN (${keluhanString}) `
        }
        
    if (category === ('semua-kategori' || '') && (search || keluhan || hargaMin || hargaMax || jenisObat || golonganObat)) {
      query1 += `WHERE `;
    }
    
    if (search) {
      if (category !== ('semua-kategori' || '')) {
        query1 += `AND `;
      }
      query1 += `nama_obat LIKE '%${search}%' `;
    }

    if (keluhan) {
      if (category !== ('semua-kategori' || '') || search) {
        query1 += `AND `;
      }
      keluhanString = keluhan.split('-').join(',');
      query1 += `keluhan_id in (${keluhanString}) `;
    }

    db.query(query1, (err, result) => {
      if (err) return res.status(500).send({ message: 'Error!', error: err });
      return res.status(200).send(result);
    });
  },

  getProductCards: async (req, res) => {
    try {
      const page = parseInt(req.query.page);
      const limit = parseInt(req.query.limit);
      const category = req.query.category;
      let keluhan = req.query.keluhan;
      let hargaMin = req.query.hargamin;
      let hargaMax = req.query.hargamax;
      let jenisObat = req.query.jenisobat;
      let golonganObat = req.query.golonganobat;
      let search = req.query.search;
      const sortBy = req.query.sortby;
      const startIndex = (page - 1) * limit;

      let query1 = `SELECT id, nama_obat AS namaObat,
            butuh_resep AS butuhResep, harga, gambar, stok,
            Keluhan_id AS keluhanId,
            KategoriObat_id AS kategoriObatId,
            SatuanObat_id AS satuanObatId,
            GolonganObat_id AS golonganObatId
            FROM produk `

            if(category == 'obat-obatan'){query1 += `WHERE KategoriObat_id = 1 `}
            if(category == 'nutrisi'){query1 += `WHERE KategoriObat_id = 2 `}
            if(category == 'herbal'){query1 += `WHERE KategoriObat_id = 3 `}
            if(category == 'vitamin-suplemen'){query1 += `WHERE KategoriObat_id = 4 `}
            if(category == 'alat-kesehatan'){query1 += `WHERE KategoriObat_id = 5 `}
            if(category == 'perawatan-tubuh'){query1 += `WHERE KategoriObat_id = 6 `}
            if(category == 'ibu-anak'){query1 += `WHERE KategoriObat_id = 7 `}
            
            if((category === ('semua-kategori' || '')) && (search || keluhan || hargaMin || hargaMax || jenisObat || golonganObat)){
                query1 += `WHERE `
            }
           
            if(search){
                if (category !== ('semua-kategori' || '')){
                    query1 += `AND `
                }
                query1 += `nama_obat LIKE '%${search}%' `
            }

            if(keluhan){
                if ((category !== ('semua-kategori' || '')) || search){
                    query1 += `AND `
                }
                keluhanString = keluhan.split('-').join(',')
                query1 += `keluhan_id IN (${keluhanString}) `
            }

            if(sortBy == 'AZ'){query1 += `ORDER BY namaObat ASC `}
            if(sortBy == 'ZA'){query1 += `ORDER BY namaObat DESC `}
            if(sortBy == 'hargaTerendah'){query1 += `ORDER BY harga ASC `}
            if(sortBy == 'hargaTertinggi'){query1 += `ORDER BY harga DESC `}
            
            query1 += `LIMIT ${startIndex},${limit};`


            const products = await query(query1)

      if (category == 'obat-obatan') {
        query1 += `WHERE KategoriObat_id = 1 `;
      }
      if (category == 'nutrisi') {
        query1 += `WHERE KategoriObat_id = 2 `;
      }
      if (category == 'herbal') {
        query1 += `WHERE KategoriObat_id = 3 `;
      }
      if (category == 'vitamin-suplemen') {
        query1 += `WHERE KategoriObat_id = 4 `;
      }
      if (category == 'alat-kesehatan') {
        query1 += `WHERE KategoriObat_id = 5 `;
      }
      if (category == 'perawatan-tubuh') {
        query1 += `WHERE KategoriObat_id = 6 `;
      }
      if (category == 'ibu-anak') {
        query1 += `WHERE KategoriObat_id = 7 `;
      }

      if (category === ('semua-kategori' || '') && (search || keluhan || hargaMin || hargaMax || jenisObat || golonganObat)) {
        query1 += `WHERE `;
      }

      if (search) {
        if (category !== ('semua-kategori' || '')) {
          query1 += `AND `;
        }
        query1 += `nama_obat LIKE '%${search}%' `;
      }

      if (keluhan) {
        if (category !== ('semua-kategori' || '') || search) {
          query1 += `AND `;
        }
        keluhanString = keluhan.split('-').join(',');
        query1 += `keluhan_id in (${keluhanString}) `;
      }

      if (sortBy == 'AZ') {
        query1 += `ORDER BY namaObat ASC `;
      }
      if (sortBy == 'ZA') {
        query1 += `ORDER BY namaObat DESC `;
      }
      if (sortBy == 'hargaTerendah') {
        query1 += `ORDER BY harga ASC `;
      }
      if (sortBy == 'hargaTertinggi') {
        query1 += `ORDER BY harga DESC `;
      }

      query1 += `LIMIT ${startIndex},${limit};`;

      const products = await query(query1);

      let query2 = `SELECT satuan_obat AS satuanObat FROM satuanobat WHERE id = ?`;
      for (let i = 0; i < products.length; i++) {
        let satuan = await query(query2, products[i].satuanObatId);
        products[i] = { ...products[i], satuanObat: satuan[0].satuanObat };
      }
      res.status(200).send(products);
    } catch (error) {
      res.status(500).send({
        status: 500,
        error: true,
        message: error.message,
      });
    }
  },

  addResep: (req, res) => {
    try {
      const path = 'Public/resep';
      const upload = uploader(path, 'RESEP').fields([{ name: 'image' }]);
      const id = req.dataToken.id;

      upload(req, res, (err) => {
        if (err) {
          return res.status(500).json({ message: 'Uplous Resep failed !', error: err.message });
        }
        const { image } = req.files;
        const imagePath = image ? path + '/' + image[0].filename : null;

        var sql = `INSERT INTO resep (gambar_resep, User_id) VALUES ('${imagePath}', '${id}');`;
        db.query(sql, (err, results) => {
          console.log('ini results', results);
          console.log('ini err', err);
          if (err) {
            return res.status(500).json({ message: 'Server Error', error: err.message });
          }

          sql = `SELECT * from resep where User_id = ${id};`;
          db.query(sql, id, (err2, results2) => {
            console.log('ini results2', results2);
            if (err2) {
              return res.status(500).json({ message: 'Server Error', error: err.message });
            }

            return res.status(200).send(results2);
          });
        });
      });
    } catch (err) {
      return res.status(500).json({ message: 'Server Error', error: err.message });
    }
  },

    getProductDetail: async(req,res) => {
        try {
            const id = parseInt(req.query.id)
            
            let query1 = `SELECT id, nama_obat AS namaObat, butuh_resep AS butuhResep, harga, gambar, stok,
            indikasi, komposisi, kemasan, cara_penyimpanan AS caraPenyimpanan,
            principal, nie, cara_pakai AS caraPakai, peringatan, Keluhan_id AS keluhanId,
            KategoriObat_id AS kategoriObatId, SatuanObat_id AS satuanObatId, GolonganObat_id AS golonganObatId
            FROM produk WHERE id = ?`;

      let productArr = await query(query1, id);
      let product = productArr[0];

      let query2 = `SELECT satuan_obat AS satuanObat FROM satuanobat WHERE id = ?`;
      let satuan = await query(query2, product.satuanObatId);
      product = { ...product, satuanObat: satuan[0].satuanObat };

      let query3 = `SELECT golongan_obat AS golonganObat FROM golonganobat WHERE id = ?`;
      let golongan = await query(query3, product.golonganObatId);
      product = { ...product, golonganObat: golongan[0].golonganObat };

      let query4 = `SELECT kategori_obat AS kategoriObat FROM kategoriobat WHERE id = ?`;
      let kategori = await query(query4, product.kategoriObatId);
      product = { ...product, kategoriObat: kategori[0].kategoriObat };

      res.status(200).send(product);
    } catch (error) {
      res.status(500).send({
        status: 500,
        error: true,
        message: error.message,
      });
    }
  },

  getRelatedProducts: async (req, res) => {
    try {
      const id = parseInt(req.query.id);
      const keluhanId = parseInt(req.query.keluhanid);
      const golonganObatId = parseInt(req.query.golonganobatid);

      const query1 = `SELECT id, nama_obat AS namaObat,
            butuh_resep AS butuhResep, harga, gambar, stok,
            SatuanObat_id AS satuanObatId
            FROM produk WHERE keluhan_id = ? 
            AND NOT id = ? LIMIT 0,5`;

      let products = await query(query1, [keluhanId, id]);

      if (products.length < 5) {
        const limit = 5 - products.length;
        const query2 = `SELECT id, nama_obat AS namaObat,
                butuh_resep AS butuhResep, harga, gambar, stok,
                SatuanObat_id AS satuanObatId
                FROM produk WHERE golonganobat_id = ? 
                AND NOT id = ? LIMIT 0,${limit}`;


                const moreProducts = await query(query2, [golonganObatId, id])
                products = [...products, ...moreProducts]
            }
           
            const query3 = `SELECT satuan_obat AS satuanObat FROM satuanobat WHERE id = ?`
            for (let i = 0; i < products.length; i++) {
                let satuan = await query(query3, products[i].satuanObatId)
                products[i] = { ...products[i], satuanObat: satuan[0].satuanObat}
            }
            
            res.status(200).send(products)

        } catch (error) {
            res.status(500).send({
                status: 500,
                error: true,
                message: error.message
            })
        }
    },

    searchProducts: async(req, res) => {
        try {
            let entry = req.query.entry

            const query1 = `SELECT COUNT(*) AS total FROM produk WHERE nama_obat LIKE ?`
            let total = await query(query1, ['%' + entry + '%'])

            const query2 = `SELECT id, nama_obat AS namaObat FROM produk WHERE nama_obat LIKE ?`
            let products1 = await query(query2, [entry + '%'])
            
            const query3 = `SELECT id, nama_obat AS namaObat FROM produk WHERE nama_obat LIKE ? AND nama_obat NOT LIKE ?`
            let products2 = await query(query3, [('%' + entry + '%'), (entry + '%')])
            
            let products = [...products1, ...products2]

            res.status(200).send({total: total, products: products})
        } catch (error) {
            res.status(500).send({
                    error: true, 
                    message: error.message
            })
        }
    },

    diskon: (req,res) => { 
        var sql = `Select produk.harga from produk`
        db.query(sql, (err,result) => {
            if(err) return res.status(500).send({ message: 'Error!', error: err})
            var newArray = []
            for (let i = 0; i < result.length; i++) {
                let hargaDiskon = result[i].harga * (10/100)
                let newHarga = result[i].harga - hargaDiskon 
                newArray.push(newHarga)
            }
            res.status(200).send({
                diskon : newArray
            })

        })
    },

    getHomeProduk: (req,res) => { 
        var sql = `SELECT *,  satuanobat.satuan_obat FROM produk JOIN satuanobat ON produk.SatuanObat_id = satuanobat.id LIMIT 4;`
        db.query(sql, (err,result) => {
            if(err) return res.status(500).send({ message: 'Error!', error: err})

            var sql2 = `Select *,  satuanobat.satuan_obat from produk JOIN satuanobat ON produk.SatuanObat_id = satuanobat.id ORDER BY produk.id DESC LIMIT 0, 5;`
            db.query(sql2, (err2,result2) => {
                if(err2) return res.status(500).send({ message: 'Error!', error: err2})
            
                res.status(200).send({
                    produkDiskon : result,
                    produkTerbaru: result2
                })
    
            })

        })
    },
   
};
