import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  ViewChild,
  AfterViewInit,
  inject
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import WaveSurfer from 'wavesurfer.js';
import EnvelopePlugin from 'wavesurfer.js/dist/plugins/envelope.js';
import HoverPlugin from 'wavesurfer.js/dist/plugins/hover.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.js';
import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline.js';
import ZoomPlugin from 'wavesurfer.js/dist/plugins/zoom.js';

import { WorkService } from '../../services/work-service';
import { AudioService } from '../../services/audio-service';
import { FormsModule } from '@angular/forms';
import { WorkDto } from '../../models/dto/work-dto';
import { __rewriteRelativeImportExtension } from 'tslib';
import { AuthService } from '../../services/authorization-service';

@Component({
	standalone: true,
	selector: 'app-listening-area',
	imports: [CommonModule, FormsModule],
	template: `
		<link rel="stylesheet"
  			href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
		<div class="container">
			<div class="scroll-text-container">
				<h1 class="title-text">
					YOU NEED NO SAINTZ YOU NEED NO SAINTZ YOU NEED NO SAINTZ YOU NEED NO SAINTZ YOU NEED NO SAINTZ YOU NEED NO SAINTZ 
					YOU NEED NO SAINTZ YOU NEED NO SAINTZ YOU NEED NO SAINTZ YOU NEED NO SAINTZ YOU NEED NO SAINTZ YOU NEED NO SAINTZ
				</h1>
			</div><br>
			<div class="button-container">
				<button class="go-to-user-page" (click)="goToUserPage()">Torna alla User Page</button>
			</div>
			<div class="img-prewave">
				<h1 class="work-title">{{work?.title?.toUpperCase()}}</h1>
				<div class="blur"></div>
				<div class="blur2"></div>
				<div class="blur3"></div>
			</div>
			<!-- Waveform + Timeline -->
			<div #waveformContainer class="waveform" [class.loaded]="audioLoaded"></div>
			<div #timelineContainer id="timeline" [class.loaded]="audioLoaded"></div>

			<!-- Pulsanti principali -->
			<div class="controls" *ngIf="audioLoaded">
				<button class="btn-play" (click)="togglePlay()">
					<i [class.ls-icon-play]="!playing" [class.ls-icon-pause]="playing"></i>
				</button>
				<span class="time-display">
					{{ formatTime(currentTime) }} / {{ formatTime(duration) }}
				</span>
				<!-- Volume -->
				<button class="btn-volume" (click)="toggleMute()">
					<i [class.ls-icon-volume]="volume > 0" [class.ls-icon-mute]="volume === 0"></i>
				</button>
				<input
					class="volume-slider"
					type="range"
					min="0" max="1" step="0.01"
					[value]="volume"
					(input)="onVolumeChange($event)"
				/>
				<div class="wave-progress">
					<div
					class="wave-progress-inner"
					[style.width.%]="progressPercent"
					></div>
				</div>
				<div class="plug-ins-div">
					<button (click)="togglePanel()" class="plug-ins">Plugins</button>
				</div>
				<div *ngIf="zoomActive" class="zoom-slider-wrapper">
					<input
						id="zoom-slider"
						type="range"
						min="1"
						max="1000"
						step="1"
						[value]="zoomLevel"
						(input)="onZoomSliderInput($event)"
					/>
				</div>
			</div>

			<!-- Pannello aggiuntivo (slide in/out) -->
			<div class="slide-panels" [class.open]="showPanel && audioLoaded">
				<button (click)="enableZoom($event)" [class.active]="zoomActive">Zoom</button>
				<button (click)="enableRegions()" [class.active]="regionsActive">Regions</button>
				<button (click)="hoverActive ? disableHover() : enableHover()" [class.active]="hoverActive">Pointer Line</button>
				<button (click)="envelopeActive ? disableEnvelope() : enableEnvelope()" [class.active]="envelopeActive">Envelope</button>

			</div><br>
			<button *ngIf="regionsActive" class="save-all-note" (mousedown)="saveNoteFull()">Send the notes to Doc</button>
			<div class="regions-notes-list">
				<ul>
					<li *ngFor="let r of regionsList" (click)="selectRegion(r)" [style.background]="r.color" class="region-item">
						<strong class="note-region-time">{{ r.start | number:'1.1-2' }} - {{ r.end | number:'1.1-2' }}</strong>
						<textarea
							[name]="'nota' + r.id"
							[id]="'nota' + r.id"
							[(ngModel)]="r.nota"
							(blur)="saveNoteFast(r)"
							placeholder="Note ({{ r.start | number:'1.0-2' }} - {{ r.end | number:'1.0-2' }})">
						</textarea>
					</li>
				</ul>
			</div>
			<footer class="site-footer">
				<div class="footer-inner">
					<div class="footer-col">
						<h4>Contact Us</h4>
						<div class="contact-actions">
							<a href="mailto:info.nosaintz@gmail.com" target="_blank"><i class="fas fa-envelope"></i></a>
							<a href="/" class="home-button"><i class="fas fa-home"></i><span></span></a>
						</div>
					</div>
					<div class="footer-col">
						<h4>Follow Us</h4>
						<ul class="social-icons">
							<li><a href="https://open.spotify.com/playlist/6Pa1vPI5eSME4VjJwM6RUI" target="_blank"><i class="fab fa-spotify"></i></a></li>
							<li><a href="https://www.instagram.com/youneednosaintz" target="_blank"><i class="fab fa-instagram"></i></a></li>
							<li><a href="https://www.facebook.com/youneednosaintz" target="_blank"><i class="fab fa-facebook-f"></i></a></li>
						</ul>
					</div>
				</div>
			</footer>
		</div>
	`,
	styleUrls: ['./listening-area.css']
})
export class ListeningArea implements OnDestroy, OnChanges, AfterViewInit{
	@ViewChild('waveformContainer', { static: true }) waveformRef!: ElementRef;
	@ViewChild('spectrogramContainer', { static: true }) spectrogramRef!: ElementRef;
	@ViewChild('timelineContainer', { static: true }) timelineRef!: ElementRef;

	private wavesurfer!: WaveSurfer;

	audioFileName?: string;
	private envelope?: ReturnType<typeof EnvelopePlugin.create>;

	private zoom?: ReturnType<typeof ZoomPlugin.create>;
	public regions?: ReturnType<typeof RegionsPlugin.create>;
	private timeline?: ReturnType<typeof TimelinePlugin.create>;
	private hover?: ReturnType<typeof HoverPlugin.create>;
	private regionsPlugin?: ReturnType<typeof RegionsPlugin.create>;

	constructor(
		private route: ActivatedRoute,
		private workService: WorkService,
		private audioService: AudioService,
		private _authService: AuthService
	) {}

	private _router = inject(Router);
	private nextRegionHue = 180;
	private zoomListenerSet = false;
	private prevVolume = 1;
	private spaceListenerRegistered = false;
	private envelopePlugin: any;
  	public envelopePoints: { time: number, volume: number }[] = [];

	//dichiarazioni per wavesurfer
	playing = false;
	panelOpen = false;
	audioLoaded = false;
	showPanel = false;
	envelopeActive = false;
	zoomActive     = false;
	regionsActive  = false;
	hoverActive    = false;
	loading = true;
  	waveformReady = false;
  	loadError = false;
	zoomLevel: number = 1;
	maxZoom: number = 200;
	minZoom: number = 1;
	trackpadZoomEnabled: boolean = false;
	currentTime = 0;
	duration = 0;
	progressPercent = 0;
	volume = 1;
	regionsList: Array<{ id: string; start: number; end: number; color: string; nota: string; elementX: number }> = [];
	selectedRegionId: string | null = null;
	work: WorkDto | undefined;

	//FUNZIONI LISTENING AREA

	public get fullUrl():string | null  {
		return this.audioFileName
		? `http://localhost:8080/api/audios/${this.audioFileName}`
		: null;
	}

	public get audioType(): string {
		if (!this.audioFileName) return 'audio/mpeg';
		const ext = this.audioFileName.split('.').pop()?.toLowerCase();
		return ext === 'wav' ? 'audio/wav' : 'audio/mpeg';
	}

	private setupTrackpadZoom(): void {
		const container = this.waveformRef.nativeElement as HTMLElement;
		container.addEventListener('wheel', (event) => {
			if(event.ctrlKey || event.metaKey) {
				event.preventDefault();
				this.trackpadZoomEnabled = true;

				const delta = Math.sign(event.deltaY);
				this.zoomLevel = Math.max(
					this.minZoom,
					Math.min(this.maxZoom, this.zoomLevel - delta * 5)
				);
				this.wavesurfer.zoom(this.zoomLevel);
			}
		});
	}

	private getNextColor() {
		const color = `hsla(${this.nextRegionHue}, 100%, 50%, 0.3)`;
		this.nextRegionHue += 15;
		if (this.nextRegionHue > 330) this.nextRegionHue = 180;
		return color;
	}

	ngOnInit() {
		this.loadRegionsFromNote();
	}


	private guardParsingNote(): void {
		if (!this.work || !this.work.nota) {
			console.warn('Nessuna nota da parsare. Work o work.nota mancante');
			return;
		}
		const raw = this.work.nota.trim();
		console.log('Raw nota value:', raw);
		console.log(`Lunghezza stringa: ${raw.length}`);
		if (raw.length > 7) {
			console.log(`Char at pos 6 (index 6): '${raw.charAt(6)}' (code ${raw.charCodeAt(6)})`);
		}
		
		if (raw.startsWith('[') && raw.endsWith(']')) {
			try {
				const data = JSON.parse(raw);
				if (Array.isArray(data) && data.every(obj => 'start' in obj && 'end' in obj)) {
					this.regionsList = data;

					if (this.regionsActive && this.regionsPlugin) {
						this.regionsList.forEach(r => {
							this.regionsPlugin!.addRegion({
								start: r.start,
								end: r.end,
								color: r.color,
								id: r.id
							});
						});
					}
					const parsed = JSON.parse(raw);
					if (parsed.envelope && this.envelopePlugin) {
						this.envelopePlugin.setPoints(parsed.envelope);
						console.log('Envelope ripristinato con', parsed.envelope);
					}
				} else {
					throw new Error('Formato non valido, manca start/end');
				}
			} catch (err) {
				console.error('Errore parsing regioni da nota JSON:', err);
			}
		} else {
			console.warn('Nota non in formato JSON, skip parsing regioni:', raw);
			this.regionsList = [];
		}
	}
	

	ngAfterViewInit(): void {
		const workId = Number(this.route.snapshot.paramMap.get('id'));
		
		this.workService.findWorkById(workId).subscribe({
			next: work => {
				if (!work.audio?.storedFileName) {
      				console.error('Nessun audio associato a questo work:', work);
					return;
    			} 

				this.work = work;

				const fullName = work.audio.storedFileName;
				console.log(fullName);
				this.audioFileName = fullName.includes('/') 
					? fullName.split('/').pop()! 
					: fullName;

				this.audioService.getByFileName(this.audioFileName).subscribe({
					next: blob => {
						if (!this.waveformRef?.nativeElement) {
							console.error('waveformRef non disponibile');
							return;
						}
						const audioUrl = URL.createObjectURL(blob);

						this.wavesurfer = WaveSurfer.create({
							container: this.waveformRef.nativeElement,
							waveColor: '#00ffff',
							progressColor: '#005e5fa9',
							cursorColor: '#333',
							backend: 'MediaElement',
							mediaControls: false,
							dragToSeek: true,
							minPxPerSec: 10,
							height: 300,
							plugins: 
								[
									TimelinePlugin.create({ container: this.timelineRef.nativeElement }),
									EnvelopePlugin.create({
										volume: 0,
										lineColor: 'transparent',
										dragPointSize: 5,
										dragPointFill: 'rgba(156, 3, 3, 1)',
										dragPointStroke: 'rgba(156, 3, 3, 1)',
										dragLine: true
									})as ReturnType<typeof EnvelopePlugin.create>
								]
						});
						this.envelope?.onInit();
						this.wavesurfer.load(audioUrl);
						this.setupTrackpadZoom();
						this.waveformRef.nativeElement.style.position = 'relative';
						this.waveformRef.nativeElement.style.zIndex = '0';
						

						this.wavesurfer.on('ready', () => {
							this.audioLoaded = true;
							this.duration = this.wavesurfer.getDuration();
							this.currentTime = 0;

							this.wavesurfer.setVolume(this.volume);
							
							
						});
						if (this.envelopeActive) {
							this.waveformRef.nativeElement.addEventListener('dblclick', this.handleEnvelopeActivation.bind(this));
						}

						this.wavesurfer.on('click', (relativeX: number) => {
							const fraction = relativeX;
							const time = fraction * this.wavesurfer.getDuration();

							if (!this.wavesurfer.isPlaying() && !this.envelopeActive) {
								this.wavesurfer.seekTo(fraction);
							}
						});

						
						this.wavesurfer.on('interaction', () => {
							const container = this.wavesurfer.getWrapper();
							container.addEventListener('wheel', this.onWheelZoomControl, { passive: false });
						});

						this.wavesurfer.on('audioprocess', (time: number) => {
							this.currentTime = time;
							this.progressPercent = (time / this.duration) * 100;
						}); 

						this.guardParsingNote();
					},
					error: err => {
						console.error('Errore download audio blob ', err)
						this.loading = false;
    					this.loadError = true;
					}
				});
				
			},
			error: err => console.error('Errore recupero work', err)
		});
	}
	ensureSingleEnvelopePoint(time: number) {
		if (!this.envelope) return;

		this.envelopePoints = this.envelopePoints.filter(p => Math.abs(p.time - time) >= 0.01);
		this.envelope.setPoints(this.envelopePoints);
		this.envelope.addPoint({ time, volume: this.volume });
	}

	//PLAY STOP AND TIMELINE WITH SS & MM + VOLUME
	formatTime(seconds: number): string {
		const m = Math.floor(seconds / 60);
		const s = Math.floor(seconds % 60);
		const mm = m.toString().padStart(2, '0');
		const ss = s.toString().padStart(2, '0');
		return `${mm}:${ss}`;
	}

	togglePlay() {
		if (this.playing) {
			this.wavesurfer.pause();
		} else {
			this.wavesurfer.play();
		}
		this.playing = !this.playing;
	}

	onVolumeChange(event: Event): void {
		this.volume = parseFloat((event.target as HTMLInputElement).value);
		this.prevVolume = this.volume;
		this.wavesurfer.setVolume(this.volume);
	}

	toggleMute(): void {
		if (this.volume > 0) {
			this.prevVolume = this.volume;
    		this.volume = 0;
		} else {
			this.volume = this.prevVolume || 1;
		}
		this.wavesurfer.setVolume(this.volume);
	}

	ngOnChanges(changes: SimpleChanges): void {
		if(changes['audioFileName'] && !changes['audioFileName'].isFirstChange()) {
			if(this.fullUrl) {
				this.wavesurfer.load(this.fullUrl);
			}
		}
	}

	onWheelZoomControl = (event: WheelEvent) => {
		if (!this.zoomActive) {
			
			event.preventDefault();
			event.stopPropagation();
		}
	};

	togglePanel() {
		this.showPanel = !this.showPanel;
	}

	//ENVELOPE
	enableEnvelope() {
		if (!this.envelope) {
			this.handleEnvelopeActivation();
		}
	}

	handleEnvelopeActivation() {
		if (!this.envelopeActive) {
			this.envelope = this.wavesurfer.registerPlugin(
				EnvelopePlugin.create({ 
					volume: this.volume
				})
			);
			console.log('ciao');

			this.envelope.addPoint({ time: this.wavesurfer.getCurrentTime(), volume: this.volume });

			this.envelope.on('points-change', (points: any[]) => {
				this.envelopePoints = points;
			});

			this.envelopeActive = true;
		}
	}

	disableEnvelope() {
		if (this.envelope) {
			this.envelope.destroy();
			this.envelope = undefined;
		}
		this.envelopeActive = false;
	}

	addEnvelopePoint(time:number, volume:number) {
		if(this.envelope && this.wavesurfer) {
			const currentTime = this.wavesurfer.getCurrentTime();
			this.envelope.addPoint({ time: currentTime, volume: 0.8 });
		}
		this.persistNotes();
	}

	removeEnvelopePoint(index: number) {
		if(this.envelopePlugin) {
			this.envelopePlugin.setPoints([]);
			this.envelopeActive = false;
			this.envelopePlugin.setVolume(this.volume);
		}
		this.persistNotes();
	}

	//ZOOM
	enableZoom(event?: Event): void {
		if (!this.zoom) {
			this.zoom = this.wavesurfer.registerPlugin(
				ZoomPlugin.create({
					scale: 0.99,
					maxZoom: 500
				})
			);
			if(!this.zoomListenerSet) {
				this.wavesurfer.on('zoom', (minPxPerSec) => {
					this.zoomLevel = minPxPerSec
				});
				this.zoomListenerSet = true;
			}
		}

		this.zoomActive = !this.zoomActive;

		const level = this.zoomActive ? this.zoomLevel : 0.90;
		this.wavesurfer.zoom(level);
		this.updateRegionPositions();
	}

	onZoomSliderInput(event: Event): void {
		const pxPerSec = parseInt((event.target as HTMLInputElement).value, 11);
		this.zoomLevel = pxPerSec;
		if (this.zoomActive) {
			this.wavesurfer.zoom(pxPerSec);
		}
	}

	//REGIONS
	private loadRegionsFromNote() {
		if (!this.work || !this.work.nota) return;
		try {
			const data = JSON.parse(this.work.nota);
			this.regionsList = Array.isArray(data) ? data : [];
			console.log('Regioni caricate', this.regionsList);
		} catch (err) {
			console.error('Errore parsing regioni da nota:', err);
			this.regionsList = [];
		}
	}

	private onRegionCreate(region: any) {
		
		const container = this.wavesurfer.getWrapper(); 
		const totalWidth = container.clientWidth;
		const startPercent = region.start / this.duration;
		const elementX = startPercent * totalWidth;

		const regionData = {
			id: region.id,
			start: region.start,
			end: region.end,
			color: region.color,
			elementX: elementX,
			nota: ''
		};
		this.regionsList.push(regionData);
		this.persistNotes();
	}

	private onRegionUpdate(region: any) {
		const r = this.regionsList.find(r => r.id === region.id);
		if (r) {
			r.start = region.start;
			r.end = region.end;

			const container = this.wavesurfer.getWrapper();
			const totalWidth = container.clientWidth;
			const startPercent = region.start / this.duration;
			r.elementX = startPercent * totalWidth;
			this.persistNotes();
		}
  	}

	private onRegionRemove(region: any) {
		this.regionsList = this.regionsList.filter(r => r.id !== region.id);
		region.remove();
		if (this.selectedRegionId === region.id) {
			this.selectedRegionId = null;
		}
		this.persistNotes();
	}

	selectRegion(r: any) {
		this.selectedRegionId = r.id;
		setTimeout(() => {
			const el = document.querySelector(`textarea[name="nota${r.id}"]`) as HTMLTextAreaElement;
			if (el) {
				el.focus();
				el.select(); 
			}
		}, 0);
  	}

	saveNoteFast(region: any): void {
		if(!this.work) return;
		const target = this.regionsList.find(r => r.id === region.id);
		if (target) target.nota = region.nota;
		this.persistNotes();
	}

	public saveNoteFull() {
		if(!this.work) return;

		this.regionsList = this.regionsList.filter(region => region.nota && region.nota.trim().length > 0);

		const payload = JSON.stringify(this.regionsList);
		
		const dto: WorkDto = {
			workId: this.work.workId,
			title: this.work.title,
			bpm: this.work.bpm,
			key: this.work.key,
			nota: payload
		};
		
		this.workService.updateWorkFull(this.work.workId, dto).subscribe({
			next: res => console.log('Tutte le note salvate con successo', res),
			error: err => console.error(err)
		});
	}

	private persistNotes(): void {
		if (!this.work) return;

		const payload = JSON.stringify(this.regionsList);

		const dto: WorkDto = {
			workId: this.work.workId,
			title: this.work.title,
			bpm: this.work.bpm,
			key: this.work.key,
			nota: payload
		};
	}

	updateRegionPositions(): void {
		const totalWidth = this.wavesurfer.getWrapper().clientWidth;
		this.regionsList.forEach(r => {
			r.elementX = (r.start / this.duration) * totalWidth;
		});
	}

	enableRegions(): void {
		if (this.regionsPlugin) {
			this.regionsActive = !this.regionsActive;
			this.regionsPlugin.getRegions().forEach(region =>
				(region.element as HTMLElement).style.display = this.regionsActive ? 'block' : 'none'
			);
			return;
		}
		const cfg: any = { dragSelection: { slop: 5 }, dragToSeek: false };
		this.regionsPlugin = this.wavesurfer.registerPlugin(RegionsPlugin.create(cfg));
		this.regionsActive = true;
		this.nextRegionHue = 180; 

		this.wavesurfer.on('click', () => {
			if (!this.regionsActive) return;
				const time = this.wavesurfer.getCurrentTime();
				const existing = this.regionsPlugin?.getRegions().find((r: any) => time >= r.start && time <= r.end);
			if (existing) {
				this.selectedRegionId = existing.id;
				return;
			}
			const regionDuration = 5;
			const start = Math.max(0, time - regionDuration / 2);
			const end = Math.min(this.duration, time + regionDuration / 2);
			const color = this.getNextColor();
			const region = this.regionsPlugin!.addRegion({ start, end, color });
			this.selectedRegionId = region.id;
			});

		this.regionsPlugin.on('region-created', region => this.onRegionCreate(region));		
		this.regionsPlugin.on('region-updated', region => this.onRegionUpdate(region));
		this.regionsPlugin.on('region-removed', region => this.onRegionRemove(region));
	}


	//TIME LINE
	enableTimeline() {
		if (!this.timeline) {
		this.timeline = this.wavesurfer.registerPlugin(
			TimelinePlugin.create({ container: '#timeline' })
		);
		}
	}

	//HOVER
	enableHover() {
		if (!this.hover) {
			this.hover = this.wavesurfer.registerPlugin(
				HoverPlugin.create({
					lineColor: '#c300ffff',
					lineWidth: 1,
					labelBackground: '#555',
					labelColor: '#fff',
					labelSize: '15px',
					labelPreferLeft: false,
				})
			);
		}
		this.hover.onInit();
		this.hoverActive = !this.hoverActive;
		// rimuoviamo o aggiungiamo il canvas pointer
		const hoverEl = this.waveformRef.nativeElement.querySelector('.wavesurfer-hover-pointer');
		if (hoverEl) hoverEl.style.display = this.hoverActive ? 'block' : 'none';
	}

	disableHover() {
		if (this.hover) {
			this.hover.destroy();
		} 
		this.hoverActive = false;
	}
	
	
	ngOnDestroy(): void {
		const container = this.wavesurfer?.getWrapper?.();
		if (container) {
			container.removeEventListener('wheel', this.onWheelZoomControl);
		}
		this.wavesurfer?.destroy();
	}

	goToUserPage(): void {
		const userId = this._authService.getUserId();
		this._router.navigate(['/user', userId!]);
	}

  
}
