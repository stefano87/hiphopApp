import 'package:flutter/material.dart';
import 'package:google_mobile_ads/google_mobile_ads.dart';
import 'package:provider/provider.dart';

import '../config/feature_flags.dart';
import '../services/admob_service.dart';
import '../services/analytics_service.dart';
import '../services/radio_service.dart';
import '../services/tab_navigation_service.dart';
import '../theme/app_theme.dart';
import 'beat_list_screen.dart';
import 'community_screen.dart';
import 'favorites_screen.dart';
import 'recordings_screen.dart';
import 'store_screen.dart';
import 'webradio_screen.dart';

class HomeShell extends StatefulWidget {
  const HomeShell({super.key});

  @override
  State<HomeShell> createState() => _HomeShellState();
}

class _HomeShellState extends State<HomeShell> {
  TabNavigationService? _nav;

  static final _screens = kEnablePremiumStore
      ? const [
          BeatListScreen(),
          StoreScreen(),
          RecordingsScreen(),
          FavoritesScreen(),
          WebradioScreen(),
        ]
      : const [
          BeatListScreen(),
          RecordingsScreen(),
          FavoritesScreen(),
          WebradioScreen(),
        ];

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) return;
      _nav = context.read<TabNavigationService>();
      _nav!.addListener(_onTabChanged);
      _syncRadioInterstitials(_nav!.currentTab);
    });
  }

  @override
  void dispose() {
    _nav?.removeListener(_onTabChanged);
    context.read<RadioService>().stopAdTimer();
    super.dispose();
  }

  void _onTabChanged() {
    if (_nav == null) return;
    _syncRadioInterstitials(_nav!.currentTab);
  }

  void _syncRadioInterstitials(int tab) {
    final nav = context.read<TabNavigationService>();
    final radio = context.read<RadioService>();

    if (tab != nav.radioTabIndex) {
      radio.stopAdTimer();
      return;
    }

    context.read<AnalyticsService>().logPageView('radio');

    final adMob = context.read<AdMobService>();
    radio.startAdTimer(() async {
      final wasPlaying = radio.isPlaying;
      if (wasPlaying) await radio.pauseForAd();
      await adMob.showInterstitial();
      if (wasPlaying) await radio.resumeAfterAd();
    });
  }

  @override
  Widget build(BuildContext context) {
    final adMob = context.watch<AdMobService>();
    final nav = context.watch<TabNavigationService>();
    final banner = adMob.bannerAd;

    return Scaffold(
      body: IndexedStack(
        index: nav.currentTab,
        children: _screens,
      ),
      bottomNavigationBar: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (banner != null)
            SizedBox(
              width: banner.size.width.toDouble(),
              height: banner.size.height.toDouble(),
              child: AdWidget(ad: banner),
            ),
          Container(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                colors: [AppColors.tabBarStart, AppColors.tabBarEnd],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
            ),
            child: SafeArea(
              top: false,
              child: BottomNavigationBar(
                currentIndex: nav.currentTab,
                onTap: nav.setTab,
                backgroundColor: Colors.transparent,
                elevation: 0,
                selectedItemColor: Colors.white,
                unselectedItemColor: Colors.white70,
                type: BottomNavigationBarType.fixed,
                selectedFontSize: 11,
                unselectedFontSize: 11,
                items: [
                  const BottomNavigationBarItem(
                    icon: Icon(Icons.music_note),
                    label: 'Beat',
                  ),
                  if (kEnablePremiumStore)
                    const BottomNavigationBarItem(
                      icon: Icon(Icons.storefront),
                      label: 'Store',
                    ),
                  const BottomNavigationBarItem(
                    icon: Icon(Icons.library_music),
                    label: 'Recordings',
                  ),
                  const BottomNavigationBarItem(
                    icon: Icon(Icons.mic),
                    label: 'Favorites',
                  ),
                  const BottomNavigationBarItem(
                    icon: Icon(Icons.radio),
                    label: 'Radio',
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  static void openCommunity(BuildContext context) {
    Navigator.of(context).push(
      MaterialPageRoute(builder: (_) => const CommunityScreen()),
    );
  }
}
