import { RES } from "../data/res";
import { cookieStore } from "../utils/lutil";
import { zutil } from "../utils/zutil";
import { BaseCtrl } from "./component/base";
import { AppCtrl } from "./app";
import { RouterCtrl } from "./network/router";

type t_audio_ctrl_link = {
  app: AppCtrl;
  router_ctrl: RouterCtrl;
};
type t_audio = {
  name: string;
  url: string;
  type: string;
  sprite: {
    [key: string]: number[];
  };
}[];
type t_font = {
  name: string;
  url: string;
  type: string;
}[];
type t_audio_status = "on" | "off";

/**音频控制器*/
export class AudioCtrl extends BaseCtrl {
  link = {} as t_audio_ctrl_link;
  private sound_manager = Laya.SoundManager;
  private audio_list: t_audio;
  private sound_status: t_audio_status;
  private music_status: t_audio_status;
  name = "audio";
  constructor() {
    super();
  }
  init() {
    this.initLink();
    this.initEvent();
    this.initStatus();
  }
  /**读取cookie设置音频的初始状态*/
  private initStatus() {
    // 如果有Cookie, 记录当前的声音状态, 读取+设置
    let sound_status = cookieStore.get("app_audio_sound_status") || "on";
    let music_status = cookieStore.get("app_audio_music_status") || "on";
    this.soundStatus = sound_status as t_audio_status;
    this.musicStatus = music_status as t_audio_status;

    // 将声音资源读取到 audio_list中
    this.audio_list = RES.audio;
    // this.sound_manager.autoStopMusic = true;
  }
  private initLink() {
    let app = zutil.queryClosest(<BaseCtrl>this, "name:app") as AppCtrl;
    let router_ctrl = zutil.getElementsByName(
      <BaseCtrl>app,
      "router"
    )[0] as RouterCtrl;
    this.link.app = app;
    this.link.router_ctrl = router_ctrl;
  }
  private initEvent() {}
  /**
   * 播放音频
   * @param audio 音频名字
   * @param sprite 音频Sprite名字, 使用合并音频中的sprite
   */
  public play(audio: string, sprite?: string) {
    if (audio == "bonus") {
      audio = audio + _.random(1, 6); // 奖金鱼有6种声音这里随机一种
    }

    let play_fn = this.sound_manager.playSound;
    /**处理播放音乐, 将背景音乐音量调小*/
    let play_callback = null;
    /**播放sprite*/
    if (sprite) {
      this.playAudioSprite(audio, sprite);
      return true;
    }
    /**是否重复播放*/
    let loops = 1;
    // 背景音乐
    if (audio.indexOf("bg") !== -1) {
      // 重复播放
      loops = 0;
      play_fn = this.sound_manager.playMusic;
      this.sound_manager.setMusicVolume(0.8);
      this.stopAll();
    } else {
      // 如果是其他音乐 现将背景音乐音量变小 等到音乐放完 再设置回去
      this.sound_manager.setMusicVolume(0.5);
      play_callback = Laya.Handler.create(null, () => {
        this.sound_manager.setMusicVolume(0.8);
      });
    }
    /**50ms后异步执行*/
    Laya.timer.once(100, this, () => {
      let audio_obj = this.findAudioRes(audio);
      if (!audio_obj || !audio_obj.url) {
        return false;
      }
      play_fn(audio_obj.url, loops, play_callback);
    });
  }
  /**
   * 播放合并音频中的sprite
   * @param audio 音频名字
   * @param sprite 音频Sprite名字, 使用合并音频中的sprite
   */
  private playAudioSprite(audio: string, sprite: string) {
    let play_fn = this.sound_manager.playSound;
    let loops = 1;
    let audio_obj = this.findAudioRes(audio, sprite);

    if (!audio_obj) {
      return false;
    }

    this.sound_manager.setMusicVolume(0.5);
    let play_callback = function() {
      this.sound_manager.setMusicVolume(0.8);
    };
    /**背景音乐url*/
    let audio_url = audio_obj.url;
    /**sprite信息*/
    let audio_sprite = audio_obj.sprite;
    let playing_sound = play_fn(
      audio_url,
      loops,
      null,
      null,
      audio_sprite[0] / 1000
    );

    Laya.timer.once(audio_sprite[1], this, () => {
      if (!playing_sound) {
        // 静音的时候playing_sound == null
        return false;
      }
      let cur_time = playing_sound.position;
      playing_sound.stop();
      play_callback();
    });
  }
  /* 在audio_list寻找音频资源
    通过audio的名字寻找 audio的url,
    通过sprite的名字找到sprite的开始时间可持续时间
  */
  private findAudioRes(
    audio: string,
    sprite?: string
  ): { url: string; sprite?: number[] } {
    let audio_list = this.audio_list;
    let index = -1,
      audio_url,
      sprite_info;
    /**先找audio_url*/
    for (let i = 0; i < audio_list.length; i++) {
      if (audio_list[i].name == audio) {
        index = i;
        audio_url = audio_list[i].url;
        break;
      }
    }
    if (!audio_url) {
      zutil.log("找不到音频audio=" + audio);
    }
    if (!sprite) {
      return {
        url: audio_url
      };
    }
    /**寻找Sprite*/
    if (!audio_list[index].sprite) {
      zutil.log("音频audio=" + audio + " has no sprite");
      return;
    }

    for (let sprite_name in audio_list[index].sprite) {
      if (sprite_name == sprite) {
        sprite_info = audio_list[index].sprite[sprite_name];
      }
    }

    if (!sprite_info) {
      zutil.log("音频audio=" + audio + ", has no sprite=" + sprite);
      return null;
    }

    return {
      url: audio_url,
      sprite: sprite_info
    };
  }
  /**
   * 停止播放音频
   * @param audio 音频的名称
   */
  public stop(audio: string) {
    var stop_fn = this.sound_manager.stopSound;
    let autio_url = this.findAudioRes(audio).url;
    if (!autio_url) {
      return true;
    }
    if (audio.indexOf("bg") !== -1) {
      this.sound_manager.stopMusic();
    }
    stop_fn(autio_url);
  }
  /**
   * 停止播放所有音频
   */
  public stopAll() {
    var self = this;
    self.sound_manager.stopAll();
  }
  /**控制音量*/
  public changeVolume(volume: number) {
    this.sound_manager.setMusicVolume(volume);
    this.sound_manager.setSoundVolume(volume);
  }
  /**获取音频的状态*/
  public get soundStatus() {
    return this.sound_status;
  }
  /**设置音频的状态*/
  public set soundStatus(status: t_audio_status) {
    if (status == this.soundStatus) {
      return;
    }
    this.sound_status = status;
    this.sound_manager.soundMuted = status == "off" ? true : false;

    cookieStore.set("app_audio_sound_status", this.soundStatus);
  }
  /**获取音频的状态*/
  public get musicStatus() {
    return this.music_status;
  }
  /**设置音频的状态*/
  public set musicStatus(status: t_audio_status) {
    if (status == this.musicStatus) {
      return;
    }
    this.music_status = status;
    this.sound_manager.musicMuted = status == "off" ? true : false;

    // 如果声音打开 自动播放当前页面的背景音乐
    // if (status == 'on') {
    //   let router_ctrl = this.link.router_ctrl;
    //   let cur_page = router_ctrl.cur_router_path;
    //   if (cur_page) {
    //     this.play('bg_' + cur_page);
    //   }
    // }

    cookieStore.set("app_audio_music_status", this.musicStatus);
  }
}
