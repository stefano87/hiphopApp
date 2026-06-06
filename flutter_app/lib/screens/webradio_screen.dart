import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../services/radio_service.dart';
import '../theme/app_theme.dart';
import '../widgets/app_header.dart';
import '../widgets/info_modal.dart';

class WebradioScreen extends StatelessWidget {
  const WebradioScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<RadioService>(
      builder: (context, radio, _) {
        final station = radio.currentStation;
        final isPlaying = radio.isPlaying;

        return Scaffold(
          backgroundColor: AppColors.background,
          appBar: AppHeader(
            title: 'Hip Hop Radio',
            subtitle: 'Listen to the best hip hop radio worldwide',
            onInfoTap: () => InfoModal.show(context),
          ),
          body: SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                AnimatedContainer(
                  duration: const Duration(milliseconds: 300),
                  transform: isPlaying
                      ? (Matrix4.identity()..translate(0.0, -5.0))
                      : Matrix4.identity(),
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [Color(0xFF1E1E1E), Color(0xFF2D2D2D)],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(16),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: isPlaying ? 0.4 : 0.3),
                        blurRadius: isPlaying ? 35 : 30,
                        offset: const Offset(0, 10),
                      ),
                    ],
                  ),
                  child: Column(
                    children: [
                      Stack(
                        children: [
                          AspectRatio(
                            aspectRatio: 16 / 10,
                            child: ClipRRect(
                              borderRadius: const BorderRadius.vertical(
                                top: Radius.circular(16),
                              ),
                              child: Image.asset(
                                station?.artwork ?? 'assets/logo.webp',
                                fit: BoxFit.cover,
                                width: double.infinity,
                              ),
                            ),
                          ),
                          if (isPlaying)
                            Positioned(
                              bottom: 16,
                              right: 16,
                              child: _Equalizer(),
                            ),
                        ],
                      ),
                      Padding(
                        padding: const EdgeInsets.all(20),
                        child: Column(
                          children: [
                            Text(
                              station?.name ?? 'Select a station',
                              style: const TextStyle(
                                fontSize: 24,
                                fontWeight: FontWeight.w700,
                                color: Colors.white,
                              ),
                              textAlign: TextAlign.center,
                            ),
                            const SizedBox(height: 8),
                            Text(
                              station?.description ??
                                  'Choose from our curated hip hop stations',
                              style: TextStyle(
                                color: Colors.white.withValues(alpha: 0.7),
                                fontSize: 14,
                              ),
                              textAlign: TextAlign.center,
                            ),
                            const SizedBox(height: 20),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                IconButton(
                                  onPressed: station == null
                                      ? null
                                      : () => radio.previousStation(),
                                  icon: const Icon(Icons.skip_previous,
                                      color: Colors.white, size: 28),
                                ),
                                Material(
                                  color: AppColors.accentOrange,
                                  shape: const CircleBorder(),
                                  child: InkWell(
                                    customBorder: const CircleBorder(),
                                    onTap: () async {
                                      try {
                                        await radio.togglePlay();
                                      } catch (_) {
                                        if (context.mounted) {
                                          ScaffoldMessenger.of(context)
                                              .showSnackBar(
                                            const SnackBar(
                                              content: Text(
                                                'Error while playing. Please try again later.',
                                              ),
                                              backgroundColor: AppColors.danger,
                                            ),
                                          );
                                        }
                                      }
                                    },
                                    child: SizedBox(
                                      width: 60,
                                      height: 60,
                                      child: Icon(
                                        isPlaying ? Icons.pause : Icons.play_arrow,
                                        color: Colors.white,
                                        size: 32,
                                      ),
                                    ),
                                  ),
                                ),
                                IconButton(
                                  onPressed: station == null
                                      ? null
                                      : () => radio.nextStation(),
                                  icon: const Icon(Icons.skip_next,
                                      color: Colors.white, size: 28),
                                ),
                              ],
                            ),
                            Row(
                              children: [
                                Icon(Icons.volume_down,
                                    color: Colors.white.withValues(alpha: 0.8)),
                                Expanded(
                                  child: Slider(
                                    value: radio.volume,
                                    onChanged: (v) => radio.setVolume(v),
                                  ),
                                ),
                                Icon(Icons.volume_up,
                                    color: Colors.white.withValues(alpha: 0.8)),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: const Color(0xFF1E1E1E),
                    borderRadius: BorderRadius.circular(16),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.2),
                        blurRadius: 16,
                        offset: const Offset(0, 6),
                      ),
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Available Stations',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w600,
                          color: Color(0xFFF3F3F3),
                        ),
                      ),
                      const SizedBox(height: 16),
                      ...List.generate(radio.stations.length, (index) {
                        final s = radio.stations[index];
                        final isActive = radio.currentStationIndex == index;
                        final stationPlaying = isActive && isPlaying;

                        return InkWell(
                          onTap: () async {
                            try {
                              await radio.selectStation(index);
                            } catch (_) {
                              if (context.mounted) {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(
                                    content: Text(
                                      'Unable to play ${s.name}. Please try again later.',
                                    ),
                                    backgroundColor: AppColors.danger,
                                  ),
                                );
                              }
                            }
                          },
                          borderRadius: BorderRadius.circular(8),
                          child: Container(
                            margin: const EdgeInsets.only(bottom: 8),
                            padding: const EdgeInsets.symmetric(vertical: 8),
                            decoration: BoxDecoration(
                              color: isActive
                                  ? AppColors.accentOrange.withValues(alpha: 0.15)
                                  : Colors.transparent,
                              borderRadius: BorderRadius.circular(8),
                              border: isActive
                                  ? const Border(
                                      left: BorderSide(
                                        color: AppColors.accentOrange,
                                        width: 3,
                                      ),
                                    )
                                  : null,
                            ),
                            child: Row(
                              children: [
                                Stack(
                                  children: [
                                    ClipRRect(
                                      borderRadius: BorderRadius.circular(8),
                                      child: Image.asset(
                                        s.artwork,
                                        width: 56,
                                        height: 56,
                                        fit: BoxFit.cover,
                                      ),
                                    ),
                                    if (stationPlaying)
                                      Container(
                                        width: 56,
                                        height: 56,
                                        decoration: BoxDecoration(
                                          color: Colors.black54,
                                          borderRadius: BorderRadius.circular(8),
                                        ),
                                        child: const Icon(
                                          Icons.music_note,
                                          color: AppColors.accentOrange,
                                        ),
                                      ),
                                  ],
                                ),
                                const SizedBox(width: 16),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        s.name,
                                        style: const TextStyle(
                                          fontWeight: FontWeight.w600,
                                          color: Colors.white,
                                        ),
                                      ),
                                      Text(
                                        s.genre,
                                        style: TextStyle(
                                          fontSize: 12,
                                          color:
                                              Colors.white.withValues(alpha: 0.6),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                                Icon(
                                  isActive
                                      ? (isPlaying ? Icons.pause : Icons.play_arrow)
                                      : Icons.arrow_forward,
                                  color: AppColors.accentOrange,
                                ),
                                const SizedBox(width: 8),
                              ],
                            ),
                          ),
                        );
                      }),
                    ],
                  ),
                ),
                const SizedBox(height: 80),
              ],
            ),
          ),
        );
      },
    );
  }
}

class _Equalizer extends StatefulWidget {
  @override
  State<_Equalizer> createState() => _EqualizerState();
}

class _EqualizerState extends State<_Equalizer>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    )..repeat();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (_, __) {
        return Row(
          crossAxisAlignment: CrossAxisAlignment.end,
          children: List.generate(5, (i) {
            final h = 8.0 + (12 * (0.5 + 0.5 * (i + _controller.value) % 1));
            return Container(
              width: 4,
              height: h,
              margin: const EdgeInsets.symmetric(horizontal: 2),
              decoration: BoxDecoration(
                color: const Color(0xFFF3F3F3),
                borderRadius: BorderRadius.circular(2),
              ),
            );
          }),
        );
      },
    );
  }
}
