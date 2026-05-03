# Neon Slots: Run (v0.1 MVP)

Balatro esintili, **mouse-only** oynanan, stratejik tempo ve midcore-casual zorluk hedefli cyberpunk/sade bir roguelike slot prototipi.

## Özellikler
- 5 reel slot sistemi
- Round bazlı hedef skor ilerleyişi
- Zincir (aynı sembol) bonusu
- Mağaza üzerinden build güçlendirme
- Tamamen mouse ile oynanış

## Çalıştırma
Bu MVP saf HTML/CSS/JS ile yazılmıştır.

Tek komutla:

```bash
./run.sh
```

Alternatif olarak:

```bash
python3 -m http.server 8000
```

Sonra tarayıcıdan aç:

`http://localhost:8000`

## v0.1 Notları
- Oynanış döngüsü: Spin → Skor → Mağaza → Sonraki Round
- 3 adet mağaza yükseltmesi (çarpan, sabit bonus, ekstra spin)
- İleriki sürümde eklenecekler:
  - Joker/pasif havuzu çeşitliliği
  - Event/Boss round sistemi
  - Kalıcı meta progression
