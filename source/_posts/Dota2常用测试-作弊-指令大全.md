---
title: Dota2常用测试(作弊)指令大全
date: 2020-12-28 14:16:08
updated: 2020-12-28 14:16:08
categories: 游戏
tags:
  - dota2 
index_img: https://images.magese.com/2020_12_26_data2_banner.jpg
banner_img: https://images.magese.com/2020_12_26_data2_banner.jpg
---

## 前排提示
要想获得完全的测试体验：
> 1. 创建房间时，服务器选择“本地主机”，或使用斧王岛（不推荐）
> 2. 勾选“允许作弊”
> 3. 进入游戏后第一时间在控制台输入`sv_cheats 1`
> 4. 本文中所有用`[]`包含的指令或代码均是需替换的
---

## 1. 在聊天框输入的命令
| 指令 | 说明 |
| ---- | ---- |
| `-gold [##]` | 获得`[##]`金钱
| `-lvlup [##]` | 升`[##]`级
| `-lvlmax` | 升到满级，技能自动学满
| `-levelbots [##]` | 所有机器人提升`[##]`级
| `-wtf` | 技能无冷却、无耗蓝
| `-unwtf` | 关闭wtf模式
| `-refresh` | 刷新状态和所有技能CD
| `-respawn` | 复活
| `-item [##]` | 获得`[##]`物品
| `-createhero [##]` | 创建一个友方`[##]`英雄
| `-createhero [##] enemy` | 创建一个敌方`[##]`英雄
| `-givebots [##]` | 所有机器人获得`[##]`物品
| `-startgame` | 开始游戏，出兵
| `-spawncreeps` | 立刻产生一波小兵
| `-spawnneutrals` | 立刻产生一波野怪
| `-spawnrune` | 立刻刷新一波神符，包括赏金神符和强化神符
| `-disablecreepspawn` | 禁止产生小兵
| `-enablecreepspawn` | 恢复产生小兵
| `-killwards` | 摧毁所有侦查守卫和岗哨守卫
| `-allvision` | 双方阵营共享视野
| `-normalvision` | 视野恢复正常
| `-trees` | 刷新树木
---

## 2. 在控制台输入的命令
| 指令 | 说明 |
| ---- | ---- |
| `dota_camera_distance [##]` | 将视角高度设置为`[##]`（默认为1134） |
| `dota_daynightcycle_pause` | 暂停日夜交替 |
| `dota_daynightcycle_toggle` | 输入一次命令交替一次日夜 |
| `dota_easybuy [#] ` | 默认0。设置为1后开启快速购买模式，所有物品免费，购买物品全图并且没有商店限制，并且可以为其他单位购买物品 |
| `dota_hero_god_mode [#]` | 默认0。设置为1后开启无敌模式，英雄不会受到伤害 |
| `dota_launch_custom_game [##]` | 进入`[##]`文件夹内的自定义游戏 |
| `dota_neutral_spawn_interval [##]` | 每隔`[##]`秒刷新一波野怪，默认为60 |
| `dota_range_display [##]` | 显示一个范围为`[##]`的圈 |
| `dota_respawn_roshan` | 刷新Roshan |
| `dota_workshoptest [#]` | 默认0。设置为1后开启测试模式（需先在控制台输入map dota进入地图） |
| `ent_text` | 显示被选中单位的调试信息（如移动速度、modifier等） |
| `ent_setpos [###] [xxx] [yyy] [zzz]` | 将ID为`[###]`的单位传送到三维坐标为（`[xxx]`, `[yyy]`, `[zzz]`）的地点（ID需要通过ent_text查询，通常为一个三位数字） |
| `fow_client_visibility [#]` | 该命令用来控制战争迷雾的可见性，默认0。值为1时无战争迷雾，值为2时战争迷雾布满地图 |
| `dota_minimap_draw_fow [#]` | 默认1。设置为0后小地图上不显示战争迷雾，地形总是清晰可见 |
| `host_timescale [##]` | `[##]`填入数字，默认为1.0，`[##]`为游戏速度倍率，最小为0.01 |
| `hud_toggle_visibility` | 输入此命令来隐藏所有HUD显示，再次输入命令后恢复 |
| `map dota` | 在离线模式下进入地图（配合dota_workshoptest 1使用可以以本地主机做服务器进行测试） |
---

## 3. 物品代码
### 3.1 基础物品
##### 3.1.1 肉山
| 代码 | 物品 |
| ---- | ---- |
| `item_aegis` | 不朽之守护 |
| `item_cheese` | 奶酪 |
| `item_refresher_shard` | 刷新球碎片 |
| `item_recipe_ultimate_scepter_2` | 阿哈利姆福佑 |

##### 3.1.2 消耗品
| 代码 | 物品 |
| ---- | ---- |
| `item_tpscroll1` | 回城卷轴 |
| `item_clarity1` | 净化药水 |
| `item_faerie_fire1` | 仙灵之火 |
| `item_smoke_of_deceit1` | 诡计之雾 |
| `item_ward_observer1` | 侦查守卫 |
| `item_ward_sentry1` | 岗哨守卫 |
| `item_enchanted_mango1` | 魔法芒果 |
| `item_flask1` | 治疗药膏 |
| `item_tango1` | 树之祭祀 |
| `item_tango_single1` | 树之祭祀（共享） |
| `item_tome_of_knowledge1` | 知识之书 |
| `item_dust1` | 显影之尘 |
| `item_bottle1` | 魔瓶 |
| `item_aghanims_shard1` | 阿哈利姆魔晶 |

##### 3.1.3 属性
| 代码 | 物品 |
| ---- | ---- |
| `item_branches` | 铁树枝干 |
| `item_gauntlets` | 力量手套 |
| `item_slippers` | 敏捷便鞋 |
| `item_mantle` | 智力斗篷 |
| `item_circlet` | 圆环 |
| `item_belt_of_strength` | 力量腰带 |
| `item_boots_of_elves` | 精灵布带 |
| `item_robe` | 法师长袍 |
| `item_crown` | 王冠 |
| `item_ogre_axe` | 食人魔之斧 |
| `item_blade_of_alacrity` | 欢欣之刃 |
| `item_staff_of_wizardry` | 魔力法杖 |

##### 3.1.4 装备
| 代码 | 物品 |
| ---- | ---- |
| `item_ring_of_protection` | 守护指环 |
| `item_quelling_blade` | 压制之刃 |
| `item_infused_raindrop` | 凝魂之露 |
| `item_orb_of_venom` | 淬毒之珠 |
| `item_blight_stone` | 枯萎之石 |
| `item_blades_of_attack` | 攻击之爪 |
| `item_gloves` | 加速手套 |
| `item_chainmail` | 锁子甲 |
| `item_quarterstaff` | 短棍 |
| `item_helm_of_iron_will` | 铁意头盔 |
| `item_broadsword` | 阔剑 |
| `item_blitz_knuckles` | 闪电指套 |
| `item_javelin` | 标枪 |
| `item_claymore` | 大剑 |
| `item_mithril_hammer` | 秘银锤 |

##### 3.1.5 其它
| 代码 | 物品 |
| ---- | ---- |
| `item_magic_stick` | 魔棒 |
| `item_wind_lace` | 风灵之纹 |
| `item_ring_of_regen` | 回复戒指 |
| `item_sobi_mask` | 贤者面罩 |
| `item_boots` | 速度之靴 |
| `item_cloak` | 抗魔斗篷 |
| `item_fluffy_hat` | 毛毛帽 |
| `item_gem` | 真视宝石 |
| `item_lifesteal` | 吸血面具 |
| `item_voodoo_mask` | 巫毒面具 |
| `item_shadow_amulet` | 暗影护符 |
| `item_ghost` | 幽魂权杖 |
| `item_blink` | 闪烁匕首 |

##### 3.1.6 神秘商店
| 代码 | 物品 |
| ---- | ---- |
| `item_ring_of_health` | 治疗指环 |
| `item_void_stone` | 虚无宝石 |
| `item_energy_booster` | 能量之球 |
| `item_vitality_booster` | 活力之球 |
| `item_point_booster` | 精气之球 |
| `item_platemail` | 板甲 |
| `item_talisman_of_evasion` | 闪避护符 |
| `item_hyperstone` | 振奋宝石 |
| `item_ultimate_orb` | 极限法球 |
| `item_demon_edge` | 恶魔刀锋 |
| `item_mystic_staff` | 神秘法杖 |
| `item_reaver` | 掠夺者之斧 |
| `item_eagle` | 鹰歌弓 |
| `item_relic` | 圣者遗物 |

### 3.2 升级物品
##### 3.2.1 配件
| 代码 | 卷轴代码 | 物品 |
| ---- | ---- | ---- |
| `item_magic_wand` | `item_recipe_magic_wand` | 魔杖 |
| `item_null_talisman` | `item_recipe_null_talisman` | 空灵挂件 |
| `item_wraith_band` | `item_recipe_wraith_band` | 怨灵系带 |
| `item_bracer` | `item_recipe_bracer` | 护腕 |
| `item_soul_ring` | `item_recipe_soul_ring` | 灵魂之戒 |
| `item_orb_of_corrosion` | `item_recipe_orb_of_corrosion` | 腐蚀之球 |
| `item_falcon_blade` | `item_recipe_falcon_blade` | 猎鹰战刃 |
| `item_power_treads` | `item_recipe_power_treads` | 动力鞋 |
| `item_phase_boots` | `item_recipe_phase_boots` | 相位鞋 |
| `item_oblivion_staff` | `item_recipe_oblivion_staff` | 空明杖 |
| `item_pers` | `item_recipe_pers` | 坚韧球 |
| `item_mask_of_madness` | `item_recipe_mask_of_madness` | 疯狂面具 |
| `item_hand_of_midas` | `item_recipe_hand_of_midas` | 迈达斯之手 |
| `item_helm_of_the_dominator` | `item_recipe_helm_of_the_dominator` | 支配头盔 |
| `item_helm_of_the_dominator_2` | `item_recipe_helm_of_the_dominator_2` | 支配头盔II |
| `item_travel_boots` | `item_recipe_travel_boots` | 远行鞋 |
| `item_travel_boots_2` | `item_recipe_travel_boots_2` | 远行鞋II |
| `item_moon_shard` | `item_recipe_moon_shard` | 银月之晶 |

##### 3.2.2 辅助
| 代码 | 卷轴代码 | 物品 |
| ---- | ---- | ---- |
| `item_ring_of_basilius` | `item_recipe_ring_of_basilius` | 王者之戒 |
| `item_headdress` | `item_recipe_headdress` | 恢复头巾 |
| `item_buckler` | `item_recipe_buckler` | 玄冥盾牌 |
| `item_urn_of_shadows` | `item_recipe_urn_of_shadows` | 影之灵龛 |
| `item_tranquil_boots` | `item_recipe_tranquil_boots` | 静谧之鞋 |
| `item_medallion_of_courage` | `item_recipe_medallion_of_courage` | 勇气勋章 |
| `item_arcane_boots` | `item_recipe_arcane_boots` | 奥术鞋 |
| `item_ancient_janggo` | `item_recipe_ancient_janggo` | 韧鼓 |
| `item_vladmir` | `item_recipe_vladmir` | 弗拉迪米尔的祭品 |
| `item_mekansm` | `item_recipe_mekansm` | 梅肯斯姆 |
| `item_holy_locket` | `item_recipe_holy_locket` | 圣洁吊坠 |
| `item_spirit_vessel` | `item_recipe_spirit_vessel` | 魂之灵瓮 |
| `item_pipe` | `item_recipe_pipe` | 洞察烟斗 |
| `item_guardian_greaves` | `item_recipe_guardian_greaves` | 卫士胫甲 |

##### 3.2.3 法器
| 代码 | 卷轴代码 | 物品 |
| ---- | ---- | ---- |
| `item_glimmer_cape` | `item_recipe_glimmer_cape` | 微光披风 |
| `item_veil_of_discord` | `item_recipe_veil_of_discord` | 纷争面纱 |
| `item_force_staff` | `item_recipe_force_staff` | 原力法杖 |
| `item_aether_lens` | `item_recipe_aether_lens` | 以太透镜 |
| `item_necronomicon_[#] (1-3)` | `item_recipe_necronomicon` | 死灵书 |
| `item_dagon_[#] (1-5)` | `item_recipe_dagon` | 达贡之神力系列 |
| `item_cyclone` | `item_recipe_cyclone` | Eul的神圣法杖 |
| `item_rod_of_atos` | `item_recipe_rod_of_atos` | 阿托斯之棍 |
| `item_solar_crest` | `item_recipe_solar_crest` | 炎阳纹章 |
| `item_orchid` | `item_recipe_orchid` | 紫怨 |
| `item_ultimate_scepter` | `item_recipe_ultimate_scepter` | 阿哈利姆神杖 |
| `item_nullifier` | `item_recipe_nullifier` | 否决坠饰 |
| `item_refresher` | `item_recipe_refresher` | 刷新球 |
| `item_sheepstick` | `item_recipe_sheepstick` | 邪恶镰刀 |
| `item_octarine_core` | `item_recipe_octarine_core` | 玲珑心 |
| `item_witch_blade` | `item_recipe_witch_blade` | 巫师之刃 |
| `item_wind_waker` | `item_recipe_wind_waker` | 风之杖 |
| `item_gungir` | `item_recipe_gungir` | 缚灵索 |

##### 3.2.4 防具
| 代码 | 卷轴代码 | 物品 |
| ---- | ---- | ---- |
| `item_hood_of_defiance` | `item_recipe_hood_of_defiance` | 挑战头巾 | 
| `item_vanguard` | `item_recipe_vanguard` | 先锋盾 | 
| `item_blade_mail` | `item_recipe_blade_mail` | 刃甲 | 
| `item_soul_booster` | `item_recipe_soul_booster` | 振魂石 | 
| `item_aeon_disk` | `item_recipe_aeon_disk` | 永恒之盘 | 
| `item_crimson_guard` | `item_recipe_crimson_guard` | 赤红甲 | 
| `item_lotus_orb` | `item_recipe_lotus_orb` | 清莲宝珠 | 
| `item_black_king_bar` | `item_recipe_black_king_bar` | 黑皇杖 | 
| `item_hurricane_pike` | `item_recipe_hurricane_pike` | 飓风长戟 | 
| `item_shivas_guard` | `item_recipe_shivas_guard` | 希瓦的守护 | 
| `item_manta` | `item_recipe_manta` | 幻影斧 | 
| `item_bloodstone` | `item_recipe_bloodstone` | 血精石 | 
| `item_sphere` | `item_recipe_sphere` | 林肯法球 | 
| `item_heart` | `item_recipe_heart` | 恐鳌之心 | 
| `item_assault` | `item_recipe_assault` | 强袭胸甲 | 
| `item_eternal_shroud` | `item_recipe_eternal_shroud` | 永世法衣 |

##### 3.2.5 兵刃
| 代码 | 卷轴代码 | 物品 |
| ---- | ---- | ---- |
| `item_lesser_crit` | `item_recipe_lesser_crit` | 水晶剑 |
| `item_armlet` | `item_recipe_armlet` | 莫尔迪基安的臂章 |
| `item_meteor_hammer` | `item_recipe_meteor_hammer` | 陨星锤 |
| `item_invis_sword` | `item_recipe_invis_sword` | 影刃 |
| `item_basher` | `item_recipe_basher` | 碎颅锤 |
| `item_monkey_king_bar` | `item_recipe_monkey_king_bar` | 金箍棒 |
| `item_bfury` | `item_recipe_bfury` | 狂战斧 |
| `item_ethereal_blade` | `item_recipe_ethereal_blade` | 虚灵之刃 |
| `item_radiance` | `item_recipe_radiance` | 辉耀 |
| `item_greater_crit` | `item_recipe_greater_crit` | 代达罗斯之殇 |
| `item_butterfly` | `item_recipe_butterfly` | 蝴蝶 |
| `item_silver_edge` | `item_recipe_silver_edge` | 白银之锋 |
| `item_rapier` | `item_recipe_rapier` | 圣剑 |
| `item_abyssal_blade` | `item_recipe_abyssal_blade` | 深渊之刃 |
| `item_bloodthorn` | `item_recipe_bloodthorn` | 血棘 |

##### 3.2.6 宝物
| 代码 | 卷轴代码 | 物品 |
| ---- | ---- | ---- |
| `item_dragon_lance` | `item_recipe_dragon_lance` | 魔龙枪 |
| `item_sange` | `item_recipe_sange` | 散华 |
| `item_yasha` | `item_recipe_yasha` | 夜叉 |
| `item_kaya` | `item_recipe_kaya` | 慧光 |
| `item_echo_sabre` | `item_recipe_echo_sabre` | 回音战刃 |
| `item_maelstrom` | `item_recipe_maelstrom` | 漩涡 |
| `item_diffusal_blade` | `item_recipe_diffusal_blade` | 净魂之刃 |
| `item_heavens_halberd` | `item_recipe_heavens_halberd` | 天堂之戟 |
| `item_desolator` | `item_recipe_desolator` | 黯灭 |
| `item_kaya_and_sange` | `item_recipe_kaya_and_sange` | 散慧对剑 |
| `item_sange_and_yasha` | `item_recipe_sange_and_yasha` | 散夜对剑 |
| `item_yasha_and_kaya` | `item_recipe_yasha_and_kaya` | 慧夜对剑 |
| `item_satanic` | `item_recipe_satanic` | 撒旦之邪力 |
| `item_skadi` | `item_recipe_skadi` | 斯嘉蒂之眼 |
| `item_mjollnir` | `item_recipe_mjollnir` | 雷神之锤 |
| `item_mage_slayer` | `item_recipe_mage_slayer` | 法师克星 |
| `item_overwhelming_blink` | `item_recipe_overwhelming_blink` | 盛势闪光 |
| `item_swift_blink` | `item_recipe_swift_blink` | 迅疾闪光 |
| `item_arcane_blink` | `item_recipe_arcane_blink` | 秘奥闪光 |

### 3.3 中立物品
##### 3.3.1 一级物品
| 代码 | 物品 |
| ---- | ---- |
| `item_keen_optic` | 基恩镜片 |
| `item_ironwood_tree` | 铁树之木 |
| `item_ocean_heart` | 海洋之心 |
| `item_broom_handle` | 扫帚柄 |
| `item_trusty_shovel` | 可靠铁铲 |
| `item_faded_broach` | 暗淡胸针 |
| `item_arcane_ring` | 奥术指环 |
| `item_royal_jelly` | 蜂王浆 |
| `item_chipped_vest` | 碎裂背心 |
| `item_possessed` | 附魂面具 |
| `item_mysterious_hat` | 仙灵饰品 |

##### 3.3.2 二级物品
| 代码 | 物品 |
| ---- | ---- |
| `item_ring_of_aquila` | 天鹰之戒 |
| `item_imp_claw` | 魔童之爪 |
| `item_nether_shawl` | 幽冥披巾 |
| `item_dragon_scale` | 炎龙之鳞 |
| `item_pupils_gift` | 学徒之礼 |
| `item_vambrace` | 臂甲 |
| `item_grove_bow` | 林野长弓 |
| `item_philosophers_stone` | 贤者石 |
| `item_essence_ring` | 精华指环 |
| `item_bullwhip` | 凌厉长鞭 |
| `item_quicksilver_amulet` | 银闪护符 |

##### 3.3.3 三级物品
| 代码 | 物品 |
| ---- | ---- |
| `item_quickening_charm` | 加速护符 |
| `item_spider_legs` | 网虫腿 |
| `item_paladin_sword` | 骑士剑 |
| `item_orb_of_destruction` | 毁灭灵球 |
| `item_titan_sliver` | 巨神残铁 |
| `item_mind_breaker` | 智灭 |
| `item_enchanted_quiver` | 魔力箭袋 |
| `item_elven_tunic` | 精灵外衣 |
| `item_cloak_of_flames` | 火焰斗篷 |
| `item_ceremonial_robe` | 祭礼长袍 |
| `item_psychic_headband` | 通灵头带 |

##### 3.3.4 四级物品
| 代码 | 物品 |
| ---- | ---- |
| `item_timeless_relic` | 永恒遗物 |
| `item_spell_prism` | 法术棱镜 |
| `item_flicker` | 闪灵 |
| `item_ninja_gear` | 忍者用具 |
| `item_illusionsts_cape` | 幻术师披风 |
| `item_the_leveller` | 平世剑 |
| `item_minotaur_horn` | 恶牛角 |
| `item_spy_gadget` | 望远镜 |
| `item_trickster_cloak` | 欺诈师斗篷 |
| `item_stormcrafter` | 风暴宝器 |
| `item_penta_edged_sword` | 五锋长剑 |

##### 3.3.5 五级物品
| 代码 | 物品 |
| ---- | ---- |
| `item_force_boots` | 原力鞋 |
| `item_desolator_2` | 寂灭 |
| `item_seer_stone` | 先哲之石 |
| `item_mirror_shield` | 神镜盾 |
| `item_apex` | 极 |
| `item_ballista` | 弩炮 |
| `item_demonicon` | 冥灵书 |
| `item_fallen_sky` | 天崩 |
| `item_pirate_hat` | 海盗帽 |
| `item_ex_machina` | 机械之心 |
| `item_giants_ring` | 巨人之戒 |
| `item_book_of_shadows` | 暗影邪典 |
---

## 4. 英雄代码
| 代码 | 英雄 |
| ---- | ---- |
| `npc_dota_hero_abaddon` | 亚巴顿 |
| `npc_dota_hero_alchemist` | 炼金术士 |
| `npc_dota_hero_axe` | 斧王 |
| `npc_dota_hero_beastmaster` | 兽王 |
| `npc_dota_hero_brewmaster` | 酒仙 |
| `npc_dota_hero_bristleback` | 钢背兽 |
| `npc_dota_hero_centaur` | 半人马战行者 |
| `npc_dota_hero_chaos_knight` | 混沌骑士 |
| `npc_dota_hero_rattletrap` | 发条技师 |
| `npc_dota_hero_doom_bringer` | 末日使者 |
| `npc_dota_hero_dragon_knight` | 龙骑士 |
| `npc_dota_hero_earth_spirit` | 大地之灵 |
| `npc_dota_hero_earthshaker` | 撼地者 |
| `npc_dota_hero_elder_titan` | 上古巨神 |
| `npc_dota_hero_huskar` | 哈斯卡 |
| `npc_dota_hero_wisp` | 艾欧 |
| `npc_dota_hero_kunkka` | 昆卡 |
| `npc_dota_hero_legion_commander` | 军团指挥官 |
| `npc_dota_hero_life_stealer` | 噬魂鬼 |
| `npc_dota_hero_lycan` | 狼人 |
| `npc_dota_hero_magnataur` | 马格纳斯 |
| `npc_dota_hero_mars` | 玛尔斯 |
| `npc_dota_hero_night_stalker` | 暗夜魔王 |
| `npc_dota_hero_omniknight` | 全能骑士 |
| `npc_dota_hero_phoenix` | 凤凰 |
| `npc_dota_hero_pudge` | 帕吉 |
| `npc_dota_hero_sand_king` | 沙王 |
| `npc_dota_hero_slardar` | 斯拉达 |
| `npc_dota_hero_snapfire` | 电炎绝手 |
| `npc_dota_hero_spirit_breaker` | 裂魂人 |
| `npc_dota_hero_sven` | 斯温 |
| `npc_dota_hero_tidehunter` | 潮汐猎人 |
| `npc_dota_hero_shredder` | 伐木机 |
| `npc_dota_hero_tiny` | 小小 |
| `npc_dota_hero_treant` | 树精卫士 |
| `npc_dota_hero_tusk` | 巨牙海民 |
| `npc_dota_hero_abyssal_underlord` | 孽主 |
| `npc_dota_hero_undying` | 不朽尸王 |
| `npc_dota_hero_skeleton_king` | 冥魂大帝 |
| `npc_dota_hero_antimage` | 敌法师 |
| `npc_dota_hero_arc_warden` | 天穹守望者 |
| `npc_dota_hero_bloodseeker` | 血魔 |
| `npc_dota_hero_bounty_hunter` | 赏金猎人 |
| `npc_dota_hero_broodmother` | 育母蜘蛛 |
| `npc_dota_hero_clinkz` | 克林克兹 |
| `npc_dota_hero_drow_ranger` | 卓尔游侠 |
| `npc_dota_hero_ember_spirit` | 灰烬之灵 |
| `npc_dota_hero_faceless_void` | 虚空假面 |
| `npc_dota_hero_gyrocopter` | 矮人直升机 |
| `npc_dota_hero_hoodwink` | 森海飞霞 |
| `npc_dota_hero_juggernaut` | 主宰 |
| `npc_dota_hero_lone_druid` | 德鲁伊 |
| `npc_dota_hero_luna` | 露娜 |
| `npc_dota_hero_medusa` | 美杜莎 |
| `npc_dota_hero_meepo` | 米波 |
| `npc_dota_hero_mirana` | 米拉娜 |
| `npc_dota_hero_monkey_king` | 齐天大圣 |
| `npc_dota_hero_morphling` | 变体精灵 |
| `npc_dota_hero_naga_siren` | 娜迦海妖 |
| `npc_dota_hero_nyx_assassin` | 司夜刺客 |
| `npc_dota_hero_pangolier` | 石鳞剑士 |
| `npc_dota_hero_phantom_assassin` | 幻影刺客 |
| `npc_dota_hero_phantom_lancer` | 幻影长矛手 |
| `npc_dota_hero_razor` | 剃刀 |
| `npc_dota_hero_riki` | 力丸 |
| `npc_dota_hero_nevermore` | 影魔 |
| `npc_dota_hero_slark` | 斯拉克 |
| `npc_dota_hero_sniper` | 狙击手 |
| `npc_dota_hero_spectre` | 幽鬼 |
| `npc_dota_hero_templar_assassin` | 圣堂刺客 |
| `npc_dota_hero_terrorblade` | 恐怖利刃 |
| `npc_dota_hero_troll_warlord` | 巨魔战将 |
| `npc_dota_hero_ursa` | 熊战士 |
| `npc_dota_hero_vengefulspirit` | 复仇之魂 |
| `npc_dota_hero_venomancer` | 剧毒术士 |
| `npc_dota_hero_viper` | 冥界亚龙 |
| `npc_dota_hero_weaver` | 编织者 |
| `npc_dota_hero_ancient_apparition` | 远古冰魄 |
| `npc_dota_hero_bane` | 祸乱之源 |
| `npc_dota_hero_batrider` | 蝙蝠骑士 |
| `npc_dota_hero_chen` | 陈 |
| `npc_dota_hero_crystal_maiden` | 水晶室女 |
| `npc_dota_hero_dark_seer` | 黑暗贤者 |
| `npc_dota_hero_dark_willow` | 邪影芳灵 |
| `npc_dota_hero_dazzle` | 戴泽 |
| `npc_dota_hero_death_prophet` | 死亡先知 |
| `npc_dota_hero_disruptor` | 干扰者 |
| `npc_dota_hero_enchantress` | 魅惑魔女 |
| `npc_dota_hero_enigma` | 谜团 |
| `npc_dota_hero_grimstroke` | 天涯墨客 |
| `npc_dota_hero_invoker` | 祈求者 |
| `npc_dota_hero_jakiro` | 杰奇洛 |
| `npc_dota_hero_keeper_of_the_light` | 光之守卫 |
| `npc_dota_hero_leshrac` | 拉席克 |
| `npc_dota_hero_lich` | 巫妖 |
| `npc_dota_hero_lina` | 莉娜 |
| `npc_dota_hero_lion` | 莱恩 |
| `npc_dota_hero_furion` | 先知 |
| `npc_dota_hero_necrolyte` | 瘟疫法师 |
| `npc_dota_hero_ogre_magi` | 食人魔魔法师 |
| `npc_dota_hero_oracle` | 神谕者 |
| `npc_dota_hero_obsidian_destroyer` | 殁境神蚀者 |
| `npc_dota_hero_puck` | 帕克 |
| `npc_dota_hero_pugna` | 帕格纳 |
| `npc_dota_hero_queenofpain` | 痛苦女王 |
| `npc_dota_hero_rubick` | 拉比克 |
| `npc_dota_hero_shadow_demon` | 暗影恶魔 |
| `npc_dota_hero_shadow_shaman` | 暗影萨满 |
| `npc_dota_hero_silencer` | 沉默术士 |
| `npc_dota_hero_skywrath_mage` | 天怒法师 |
| `npc_dota_hero_storm_spirit` | 风暴之灵 |
| `npc_dota_hero_techies` | 工程师 |
| `npc_dota_hero_tinker` | 修补匠 |
| `npc_dota_hero_visage` | 维萨吉 |
| `npc_dota_hero_void_spirit` | 虚无之灵 |
| `npc_dota_hero_warlock` | 术士 |
| `npc_dota_hero_windrunner` | 风行者 |
| `npc_dota_hero_winter_wyvern` | 寒冬飞龙 |
| `npc_dota_hero_witch_doctor` | 巫医 |
| `npc_dota_hero_zuus` | 宙斯 |
---

## 5. 其它单位
### 5.1 单位
| 代码 | 单位 |
| ---- | ---- |
| `npc_dota_creep_badguys_melee` | 夜魇近战兵 |
| `npc_dota_creep_badguys_melee_upgraded` | 夜魇近战高级兵 |
| `npc_dota_creep_badguys_melee_upgraded_mega` | 夜魇近战超级兵 |
| `npc_dota_creep_badguys_ranged` | 夜魇远程兵 |
| `npc_dota_creep_badguys_ranged_upgraded` | 夜魇远程高级兵 |
| `npc_dota_creep_badguys_ranged_upgraded_mega` | 夜魇远程超级兵 |
| `npc_dota_badguys_siege` | 夜魇攻城单位 |
| `npc_dota_badguys_siege_upgraded` | 夜魇高级攻城单位 |
| `npc_dota_badguys_siege_upgraded_mega` | 夜魇超级攻城单位 |
| `npc_dota_creep_goodguys_melee` | 天辉近战兵 |
| `npc_dota_creep_goodguys_melee_upgraded` | 天辉高级近战兵 |
| `npc_dota_creep_goodguys_melee_upgraded_mega` | 天辉超级近战兵 |
| `npc_dota_creep_goodguys_ranged` | 天辉远程兵 |
| `npc_dota_creep_goodguys_ranged_upgraded` | 天辉高级远程兵 |
| `npc_dota_creep_goodguys_ranged_upgraded_mega` | 天辉超级远程兵 |
| `npc_dota_goodguys_siege` | 天辉攻城单位 |
| `npc_dota_goodguys_siege_upgraded` | 天辉高级攻城单位 |
| `npc_dota_goodguys_siege_upgraded_mega` | 天辉超级攻城单位 |

### 5.2 建筑物
| 代码 | 建筑 |
| ---- | ---- |
| `npc_dota_badguys_fort` | 夜魇遗迹 |
| `npc_dota_badguys_filler` | 夜魇其它建筑 |
| `npc_dota_badguys_melee_rax_top` | 夜魇上路近战兵营 |
| `npc_dota_badguys_melee_rax_mid` | 夜魇中路近战兵营 |
| `npc_dota_badguys_melee_rax_bot` | 夜魇下路近战兵营 |
| `npc_dota_badguys_range_rax_top` | 夜魇上路远程兵营 |
| `npc_dota_badguys_range_rax_mid` | 夜魇中路远程兵营 |
| `npc_dota_badguys_range_rax_bot` | 夜魇下路远程兵营 |
| `npc_dota_badguys_tower[#]_top (1-3)` | 夜魇第#层上塔 |
| `npc_dota_badguys_tower[#]_mid (1-3)` | 夜魇第#层中塔 |
| `npc_dota_badguys_tower[#]_bot (1-3)` | 夜魇第#层下塔 |
| `npc_dota_badguys_tower4` | 夜魇第四层防御塔 |
| `npc_dota_goodguys_fort` | 天辉遗迹 |
| `npc_dota_goodguys_filler` | 天辉其它建筑 |
| `npc_dota_goodguys_melee_rax_top` | 天辉上路近战兵营 |
| `npc_dota_goodguys_melee_rax_mid` | 天辉中路近战兵营 |
| `npc_dota_goodguys_melee_rax_bot` | 天辉下路近战兵营 |
| `npc_dota_goodguys_range_rax_top` | 天辉上路远程兵营 |
| `npc_dota_goodguys_range_rax_mid` | 天辉中路远程兵营 |
| `npc_dota_goodguys_range_rax_bot` | 天辉下路远程兵营 |
| `npc_dota_goodguys_tower[#]_top (1-3)` | 天辉第#层上塔 |
| `npc_dota_goodguys_tower[#]_mid (1-3)` | 天辉第#层中塔 |
| `npc_dota_goodguys_tower[#]_bot (1-3)` | 天辉第#层下塔 |
| `npc_dota_goodguys_tower4` | 天辉第四层防御塔 |
| `dota_fountain` | 泉水 |
| `npc_dota_watch_tower` | 前哨 |

### 5.3 中立生物
| 代码 | 生物 |
| ---- | ---- |
| `npc_dota_neutral_fel_beast` | 魔能之魂 |
| `npc_dota_neutral_ghost` | 鬼魂 |
| `npc_dota_neutral_forest_troll_berserker` | 丘陵巨魔狂战士 |
| `npc_dota_neutral_forest_troll_high_priest` | 丘陵巨魔牧师 |
| `npc_dota_neutral_harpy_scout` | 鹰身女妖侦察者 |
| `npc_dota_neutral_harpy_storm` | 鹰身女妖风暴巫师 |
| `npc_dota_neutral_kobold` | 狗头人 |
| `npc_dota_neutral_kobold_tunneler` | 狗头人士兵 |
| `npc_dota_neutral_kobold_taskmaster` | 狗头人长官 |
| `npc_dota_neutral_giant_wolf` | 巨狼 |
| `npc_dota_neutral_alpha_wolf` | 头狼 |
| `npc_dota_neutral_mud_golem` | 泥土傀儡 |
| `npc_dota_neutral_ogre_mauler` | 食人魔拳手 |
| `npc_dota_neutral_ogre_magi` | 食人魔冰霜法师 |
| `npc_dota_neutral_centaur_outrunner` | 半人马猎手 |
| `npc_dota_neutral_centaur_khan` | 半人马征服者 |
| `npc_dota_neutral_dark_troll` | 丘陵巨魔 |
| `npc_dota_neutral_dark_troll_warlord` | 黑暗巨魔召唤法师 |
| `npc_dota_neutral_polar_furbolg_champion` | 地狱熊怪 |
| `npc_dota_neutral_polar_furbolg_ursa_warrior` | 地狱熊怪粉碎者 |
| `npc_dota_neutral_satyr_trickster` | 萨特放逐者 |
| `npc_dota_neutral_satyr_soulstealer` | 萨特窃神者 |
| `npc_dota_neutral_satyr_hellcaller` | 萨特苦难使者 |
| `npc_dota_neutral_wildkin` | 枭兽 |
| `npc_dota_neutral_enraged_wildkin` | 枭兽撕裂者 |

### 5.4 远古生物
| 代码 | 远古 |
| ---- | ---- |
| `npc_dota_roshan` | 肉山 |
| `npc_dota_neutral_black_drake` | 远古黑蜉蝣 |
| `npc_dota_neutral_black_dragon` | 远古黑龙 |
| `npc_dota_neutral_granite_golem` | 远古花岗石傀儡 |
| `npc_dota_neutral_rock_golem` | 远古岩石傀儡 |
| `npc_dota_neutral_small_thunder_lizard` | 远古岚肤兽 |
| `npc_dota_neutral_big_thunder_lizard` | 远古雷肤兽 |

### 5.5 召唤物
##### 5.5.1 常规召唤物
| 代码 | 召唤物 |
| ---- | ---- |
| `npc_dota_courier` | 动物信使（召唤物） |
| `npc_dota_beastmaster_boar_[#] (1-4)` | 豪猪（召唤物） |
| `npc_dota_beastmaster_hawk_[#] (1-4)` | 战鹰（召唤物） |
| `npc_dota_broodmother_spiderling` | 蜘蛛幼虫（召唤物） |
| `npc_dota_broodmother_spiderite` | 蜘蛛寄生（召唤物） |
| `npc_dota_dark_troll_warlord_skeleton_warrior` | 骷髅战士（召唤物） |
| `npc_dota_wraith_king_skeleton_warrior` | 冥魂大帝骷髅兵 |
| `npc_dota_lesser_eidolon` | 次级精神体（召唤物） |
| `npc_dota_eidolon` | 精神体（召唤物） |
| `npc_dota_greater_eidolon` | 巨型精神体（召唤物） |
| `npc_dota_dire_eidolon` | 恐怖精神体（召唤物） |
| `npc_dota_invoker_forged_spirit` | 熔炉精灵（召唤物） |
| `npc_dota_lycan_wolf[#] (1-4)` | 精灵狼（召唤物） |
| `npc_dota_necronomicon_archer_[#] (1-3)` | 死灵射手（召唤物） |
| `npc_dota_necronomicon_warrior_[#] (1-3)` | 死灵战士（召唤物） |
| `npc_dota_neutral_mud_golem_split_doom` | 小末日使者（召唤物） |
| `npc_dota_neutral_mud_golem_split` | 碎土傀儡（召唤物） |
| `npc_dota_furion_treant` | 树人（召唤物） |
| `npc_dota_furion_treant_large` | 大树人（召唤物） |
| `npc_dota_unit_undying_zombie` | 不朽僵尸（召唤物） |
| `npc_dota_unit_undying_zombie_torso` | 不死僵尸（召唤物） |

##### 5.5.2 英雄级单位
| 代码 | 召唤物 |
| ---- | ---- |
| `npc_dota_brewmaster_earth_[#] (1-3)` | 大地（召唤物） |
| `npc_dota_brewmaster_fire_[#] (1-3)` | 烈火（召唤物） |
| `npc_dota_brewmaster_storm_[#] (1-3)` | 狂风（召唤物） |
| `npc_dota_brewmaster_void_[#] (1-3)` | 虚无（召唤物） |
| `npc_dota_lone_druid_bear[#] (1-4)` | 熊灵（召唤物） |
| `npc_dota_visage_familiar[#] (1-3)` | 佣兽（召唤物） |
| `npc_dota_warlock_golem_[#] (1-3)` | 地狱火（召唤物） |
| `npc_dota_warlock_golem_scepter_[#] (1-3)` | 地狱火 （A杖升级） |

##### 5.5.3 守卫
| 代码 | 召唤物 |
| ---- | ---- |
| `npc_dota_techies_land_mine` | 地雷 |
| `npc_dota_techies_stasis_trap` | 静滞陷阱 |
| `npc_dota_techies_remote_mine` | 遥控炸弹 |
| `npc_dota_juggernaut_healing_ward` | 治疗守卫 |
| `npc_dota_pugna_nether_ward_[#] (1-4)` | 幽冥守卫 |
| `npc_dota_venomancer_plague_ward_[#] (1-4)` | 瘟疫守卫 |
| `npc_dota_rattletrap_cog` | 能量齿轮 |
| `npc_dota_unit_tombstone[#] (1-4)` | 墓碑 |
| `npc_dota_witch_doctor_death_ward` | 死亡守卫 |
| `npc_dota_shadow_shaman_ward_[#] (1-3)` | 群蛇守卫 |
| `npc_dota_templar_assassin_psionic_trap` | 灵能陷阱 |
| `npc_dota_ignis_fatuus` | 幻火（召唤物） |
| `npc_dota_phoenix_sun` | 超新星 |
| `npc_dota_clinkz_skeleton_archer` | 烈焰骷髅弓手 |
| `npc_dota_observer_wards` | 侦查守卫 |
| `npc_dota_sentry_wards` | 岗哨守卫 |

##### 5.5.4 虚拟/技能单位
| 代码 | 召唤物 |
| ---- | ---- |
| `npc_dota_units_base` | Base unit（基础单位） |
| `npc_dota_elder_titan_ancestral_spirit` | 星体游魂 |
| `npc_dota_treant_eyes` | 丛林之眼 |
| `npc_dota_gyrocopter_homing_missile` | 追踪导弹 |
| `npc_dota_healing_campfire` | 疗伤营火 |
| `npc_dota_techies_minefield_sign` | 雷区标识 |
| `npc_dota_plasma_field` | 等离子场 |
| `npc_dota_rattletrap_rocket` | 照明火箭 |
| `npc_dota_slark_visual` | 斯拉克视觉效果 |
| `npc_dota_broodmother_web` | 蛛网 |
| `npc_dota_wisp_spirit` | 幽魂 |
| `npc_dota_stormspirit_remnant` | 残影 |
| `npc_dota_ember_spirit_remnant` | 残焰 |
| `npc_dota_earth_spirit_stone` | 残岩 |
| `npc_dota_weaver_swarm` | 虫群 |
| `npc_dota_companion` | 同伴 |
| `npc_dota_thinker` | Thinker |
| `npc_dota_troll_warlord_axe` | 旋风飞斧 |
| `npc_dota_beastmaster_axe` | 野性之斧 |
| `npc_dota_enraged_wildkin_tornado` | 飓风 |
---

## 6. 被遗忘的
### 6.1 物品
| 代码 | 物品 |
| ---- | ---- |
| `item_tome_of_aghanim` | 阿哈利姆之书 |
| `item_elixer` | 万灵药水 |
| `item_helm_of_the_undying` | 不朽尸王的头盔 |
| `item_third_eye` | 第三只眼 |
| `item_phoenix_ash` | 凤凰余烬 |
| `item_fusion_rune` | 聚合神符 |
| `item_greater_mango` | 高级芒果 |
| `item_horizon` | 视界 |
| `item_dimensional_doorway` | 任意门 |
| `item_poor_mans_shield` | 穷鬼盾 |
| `item_iron_talon` | 寒铁钢爪 |
| `item_mango_tree` | 芒果树 |
| `item_vampire_fangs` | 吸血鬼獠牙 |
| `item_clumsy_net` | 笨拙渔网 |
| `item_repair_kit` | 维修器具 |
| `item_craggy_coat` | 崎岖外衣 |
| `item_greater_faerie_fire` | 高级仙灵之火 |
| `item_witless_shako` | 无知小帽 |
| `item_princes_knife` | 亲王短刀 |
| `item_havoc_hammer` | 浩劫巨锤 |
| `item_panic_button` | 神妙明灯 |
| `item_woodland_striders` | 林地神行靴 |
| `item_recipe_trident` | 三元重戟 |

### 6.2 单位
| 代码 | 单位 |
| ---- | ---- |
| `npc_dota_goodguys_healers` | 天辉圣坛 |
| `npc_dota_badguys_healers` | 夜魇圣坛 |
| `npc_dota_neutral_prowler_acolyte` | 远古侍僧潜行者 |
| `npc_dota_neutral_prowler_shaman` | 远古萨满潜行者 |
| `npc_dota_neutral_jungle_stalker` | 远古潜行者 |
| `npc_dota_neutral_elder_jungle_stalker` | 远古潜行者长老 |
