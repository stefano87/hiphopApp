import 'package:flutter/material.dart';

import '../models/beat.dart';

/// Product IDs must match Google Play Console → Monetize → Products.
const kAllBeatPackProductIds = {
  'beat_pack_hiphop',
  'beat_pack_trap',
  'beat_pack_drill',
  'beat_pack_full',
};

const kHipHopPremiumBeatCount = 15;
const kTrapPremiumBeatCount = 15;
const kDrillPremiumBeatCount = 15;

int get kPremiumBeatTotalCount =>
    kHipHopPremiumBeatCount + kTrapPremiumBeatCount + kDrillPremiumBeatCount;

List<BeatPack> getBeatPacksCatalog() {
  return [
    BeatPack(
      productId: 'beat_pack_hiphop',
      title: 'Hip Hop Pack',
      description:
          '$kHipHopPremiumBeatCount exclusive new hip hop beats for freestyle and recording.',
      emoji: '🎤',
      gradient: const [Color(0xFFFF5500), Color(0xFFFF8800)],
      beats: _generatePackBeats(
        packId: 'hiphop',
        prefix: 'Hip Hop Beat',
        startId: 10001,
        count: kHipHopPremiumBeatCount,
      ),
    ),
    BeatPack(
      productId: 'beat_pack_trap',
      title: 'Trap Pack',
      description:
          '$kTrapPremiumBeatCount exclusive new trap beats — 808, dark and melodic.',
      emoji: '🔥',
      gradient: const [Color(0xFF8E44AD), Color(0xFFEC4899)],
      beats: _generatePackBeats(
        packId: 'trap',
        prefix: 'Trap Beat',
        startId: 10101,
        count: kTrapPremiumBeatCount,
      ),
    ),
    BeatPack(
      productId: 'beat_pack_drill',
      title: 'Drill Pack',
      description:
          '$kDrillPremiumBeatCount exclusive drill beats — dark, sliding, UK/NY vibes.',
      emoji: '⚡',
      gradient: const [Color(0xFF1A1A2E), Color(0xFFE94560)],
      beats: _generatePackBeats(
        packId: 'drill',
        prefix: 'Drill Beat',
        startId: 10201,
        count: kDrillPremiumBeatCount,
      ),
    ),
    BeatPack(
      productId: 'beat_pack_full',
      title: 'Full Premium Bundle',
      description:
          'All $kPremiumBeatTotalCount beats: $kHipHopPremiumBeatCount hip hop + '
          '$kTrapPremiumBeatCount trap + $kDrillPremiumBeatCount drill. Best value.',
      emoji: '👑',
      gradient: const [Color(0xFFFFD700), Color(0xFFFF5500)],
      beats: [
        ..._generatePackBeats(
          packId: 'hiphop',
          prefix: 'Hip Hop Beat',
          startId: 10001,
          count: kHipHopPremiumBeatCount,
        ),
        ..._generatePackBeats(
          packId: 'trap',
          prefix: 'Trap Beat',
          startId: 10101,
          count: kTrapPremiumBeatCount,
        ),
        ..._generatePackBeats(
          packId: 'drill',
          prefix: 'Drill Beat',
          startId: 10201,
          count: kDrillPremiumBeatCount,
        ),
      ],
    ),
  ];
}

List<Beat> _generatePackBeats({
  required String packId,
  required String prefix,
  required int startId,
  required int count,
}) {
  return List.generate(count, (i) {
    final n = i + 1;
    return Beat(
      id: startId + i,
      name: '$prefix $n',
      url: 'https://www.gadgetchespaccano.it/beat2025/premium/${packId}$n.mp3',
    );
  });
}

List<Beat> getUnlockedPremiumBeats(Set<String> ownedProductIds) {
  // Full bundle already contains all 45 beats — do not also merge single packs.
  if (ownedProductIds.contains('beat_pack_full')) {
    return getBeatPacksCatalog()
        .firstWhere((p) => p.productId == 'beat_pack_full')
        .beats;
  }

  final beats = <Beat>[];
  final seenIds = <int>{};
  for (final pack in getBeatPacksCatalog()) {
    if (pack.productId == 'beat_pack_full') continue;
    if (!ownedProductIds.contains(pack.productId)) continue;
    for (final beat in pack.beats) {
      if (seenIds.add(beat.id)) beats.add(beat);
    }
  }
  return beats;
}

class BeatPack {
  final String productId;
  final String title;
  final String description;
  final String emoji;
  final List<Color> gradient;
  final List<Beat> beats;

  const BeatPack({
    required this.productId,
    required this.title,
    required this.description,
    required this.emoji,
    required this.gradient,
    required this.beats,
  });
}
